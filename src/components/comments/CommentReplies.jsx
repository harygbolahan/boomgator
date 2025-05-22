import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, X, Send, MessageSquare, ArrowLeft, UserCircle, ThumbsUp, Clock, Calendar, MoreHorizontal } from "lucide-react";
import { toast } from "react-toastify";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useBoom } from "@/contexts/BoomContext";
import { PostSelector } from "./PostSelector";

// The replyTypes with their corresponding colors
const replyTypes = [
	{ value: "admin", label: "Admin", color: "bg-blue-500" },
	{ value: "auto", label: "Auto", color: "bg-green-500" },
	{ value: "fan", label: "Fan", color: "bg-purple-500" }
];

// EmptyState component
const EmptyState = ({ message }) => (
	<motion.div 
		initial={{ opacity: 0 }}
		animate={{ opacity: 1 }}
		className="flex flex-col items-center justify-center p-8 border border-dashed rounded-xl text-center"
	>
		<div className="rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mb-4">
			<MessageSquare className="h-6 w-6 text-primary" />
		</div>
		<h3 className="font-medium text-lg mb-2">No Comments Found</h3>
		<p className="text-muted-foreground mb-6 max-w-md">
			{message || "Select a page and post to view comments."}
		</p>
	</motion.div>
);

// Reply Dialog component
const ReplyDialog = ({ open, onOpenChange, comment, onSubmit }) => {
	const [content, setContent] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState(null);
	
	useEffect(() => {
		if (open && comment) {
			setContent("");
			setError(null);
		}
	}, [open, comment]);
	
	const handleSubmit = async () => {
		if (!content.trim()) {
			toast.error("Reply content cannot be empty");
			return;
		}
		
		setIsSubmitting(true);
		setError(null);
		
		try {
			await onSubmit({
				page_id: comment.page_id,
				post_id: comment.post_id,
				comment_id: comment.comment_id,
				content: content,
			});
			
			onOpenChange(false);
		} catch (error) {
			console.error("Reply submission error:", error);
			setError(error.message || "Failed to send reply");
			toast.error(`Failed to send reply: ${error.message}`);
		} finally {
			setIsSubmitting(false);
		}
	};
	
	if (!comment) return null;
	
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>Reply to Comment</DialogTitle>
					<DialogDescription>
						Reply to comment from {comment.reply || "user"}
					</DialogDescription>
				</DialogHeader>
				
				<div className="bg-muted/50 p-3 rounded-md my-4">
					<p className="text-sm font-medium">{comment.content}</p>
					<p className="text-xs text-muted-foreground mt-2">From: {comment.reply || 'Unknown'}</p>
				</div>
				
				<div className="grid gap-4 mb-4">
					<div className="grid gap-2">
						<label className="text-sm font-medium">
							Your Reply
						</label>
						<Textarea
							placeholder="Type your reply here..."
							value={content}
							onChange={(e) => setContent(e.target.value)}
							rows={4}
						/>
						{error && (
							<p className="text-sm text-red-500 mt-1">{error}</p>
						)}
					</div>
				</div>
				
				<DialogFooter>
					<Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
						Cancel
					</Button>
					<Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
						{isSubmitting ? "Sending..." : "Send Reply"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

// Format relative time
const formatRelativeTime = (dateString) => {
	if (!dateString) return null;
	
	try {
		const date = new Date(dateString);
		if (isNaN(date.getTime())) return null;
		
		const now = new Date();
		const diffMs = now - date;
		const diffSecs = Math.floor(diffMs / 1000);
		const diffMins = Math.floor(diffSecs / 60);
		const diffHours = Math.floor(diffMins / 60);
		const diffDays = Math.floor(diffHours / 24);
		
		if (diffSecs < 60) return `${diffSecs}s ago`;
		if (diffMins < 60) return `${diffMins}m ago`;
		if (diffHours < 24) return `${diffHours}h ago`;
		if (diffDays < 7) return `${diffDays}d ago`;
		
		return date.toLocaleDateString();
	} catch (e) {
		return null;
	}
};

// Get avatar for comment author
const getAvatarForUser = (userName) => {
	if (!userName) return null;
	
	// Get initials from name
	const initials = userName
		.split(' ')
		.map(word => word[0])
		.join('')
		.toUpperCase()
		.slice(0, 2);
	
	// Generate background color based on name
	const colors = [
		"bg-blue-500",
		"bg-green-500",
		"bg-purple-500",
		"bg-orange-500",
		"bg-pink-500",
		"bg-teal-500",
		"bg-red-500",
		"bg-indigo-500"
	];
	
	const colorIndex = userName
		.split('')
		.reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
	
	return {
		initials,
		color: colors[colorIndex]
	};
};

// Main CommentReplies component
export const CommentReplies = () => {
	const { getPages, getPagePosts, getAllCommentReplies, getCommentRepliesByCommentId, addCommentReply } = useBoom();
	
	// State management
	const [loading, setLoading] = useState(true);
	const [pages, setPages] = useState([]);
	const [posts, setPosts] = useState([]);
	const [comments, setComments] = useState([]);
	const [selectedPage, setSelectedPage] = useState("");
	const [selectedPost, setSelectedPost] = useState("");
	const [showReplyDialog, setShowReplyDialog] = useState(false);
	const [selectedComment, setSelectedComment] = useState(null);
	const [error, setError] = useState(null);
	
	// Fetch pages on component mount
	useEffect(() => {
		fetchPages();
	}, []);
	
	// Fetch pages from API
	const fetchPages = async () => {
		try {
			setLoading(true);
			setError(null); // Reset error state
			const response = await getPages();
			console.log('Pages Response:', response);
			
			if (!response) {
				console.error("No response received from getPages");
				setError("Failed to load pages: No response received");
				setPages([]);
				return;
			}

			if (!Array.isArray(response)) {
				console.error("Invalid response format from getPages:", response);
				setError("Failed to load pages: Invalid response format");
				setPages([]);
				return;
			}

			const validPages = response.filter(page => page && page.page_id);
			console.log('Valid pages:', validPages);
			setPages(validPages);
		} catch (error) {
			console.error("Error fetching pages:", error);
			setError("Failed to load pages: " + (error.message || "Unknown error"));
			setPages([]);
		} finally {
			setLoading(false);
		}
	};
	
	// Fetch posts when page is selected
	const fetchPosts = async (pageId) => {
		if (!pageId) return;
		
		try {
			setLoading(true);
			setSelectedPost(""); // Reset selected post
			setComments([]); // Reset comments
			setError(null); // Reset error state
			
			console.log('Fetching posts for page ID:', pageId);
			const response = await getPagePosts(pageId);
			console.log('Posts Response:', response);
			
			if (!response) {
				console.error("No response received from getPagePosts");
				setError("Failed to load posts: No response received");
				setPosts([]);
				return;
			}

			if (!Array.isArray(response)) {
				console.error("Invalid response format for posts:", response);
				setError("Failed to load posts: Invalid response format");
				setPosts([]);
				return;
			}

			// Filter out invalid posts and normalize message field
			const validPosts = response.filter(post => post && post.post_id).map(post => ({
				...post,
				message: post.message || post.messages || post.content || "No content"
			}));
			console.log('Valid posts:', validPosts);
			setPosts(validPosts);
		} catch (error) {
			console.error("Error fetching posts:", error);
			setError("Failed to load posts: " + (error.message || "Unknown error"));
			setPosts([]);
		} finally {
			setLoading(false);
		}
	};
	
	// Fetch comments when post is selected
	const fetchComments = async (postId) => {
		if (!postId) return;
		
		try {
			setLoading(true);
			setError(null); // Reset error state
			console.log('Fetching comments for post ID:', postId);

			const response = await getAllCommentReplies({
				post_id: postId
			});
			console.log('Comments Response:', response);
			
			if (!response) {
				console.error("No response received from getAllCommentReplies");
				setError("Failed to load comments: No response received");
				setComments([]);
				return;
			}

			if (!Array.isArray(response)) {
				console.error("Invalid response format for comments:", response);
				setError("Failed to load comments: Invalid response format");
				setComments([]);
				return;
			}

			// Filter valid comments and ensure unique keys by adding index if needed
			const validComments = response
				.filter(comment => comment && comment.comment_id)
				.map((comment, index) => ({
					...comment,
					// Add unique identifier by combining comment_id with index if duplicates exist
					uniqueId: `${comment.comment_id}_${index}`
				}));
				
			console.log('Valid comments:', validComments);
			setComments(validComments);
		} catch (error) {
			console.error("Error fetching comments:", error);
			setError("Failed to load comments: " + (error.message || "Unknown error"));
			setComments([]);
		} finally {
			setLoading(false);
		}
	};
	
	// Handle page selection
	const handlePageChange = (pageId) => {
		setSelectedPage(pageId);
		// When a new page is selected, fetch its posts
		fetchPosts(pageId);
	};
	
	// Handle post selection
	const handlePostChange = (postId) => {
		setSelectedPost(postId);
		// When a new post is selected, fetch its comments
		fetchComments(postId);
	};
	
	// Handle reply to comment
	const handleReply = (comment) => {
		setSelectedComment({
			...comment,
			page_id: selectedPage,
			post_id: selectedPost
		});
		setShowReplyDialog(true);
	};
	
	// Handle submit reply
	const handleSubmitReply = async (replyData) => {
		try {
			console.log('Sending reply with data:', {
				page_id: replyData.page_id,
				post_id: replyData.post_id,
				comment_id: replyData.comment_id,
				reply_message: replyData.content
			});
			
			const response = await addCommentReply({
				page_id: replyData.page_id,
				post_id: replyData.post_id,
				comment_id: replyData.comment_id,
				content: replyData.content
			});
			
			console.log('Reply response:', response);
			
			// Refresh comments list
			await fetchComments(selectedPost);
			
			return response;
		} catch (error) {
			console.error('Error submitting reply:', error);
			
			// Log detailed error information
			if (error.response) {
				// The request was made and the server responded with a status code outside of 2xx
				console.error('Error response data:', error.response.data);
				console.error('Error response status:', error.response.status);
				console.error('Error response headers:', error.response.headers);
			} else if (error.request) {
				// The request was made but no response was received
				console.error('Error request:', error.request);
			}
			
			throw error;
		}
	};

	return (
		<div className="space-y-6">
			<h2 className="text-2xl font-bold">Comments Management</h2>
			
			<div className="grid gap-4 sm:grid-cols-2">
				{/* Page Selection */}
				<div className="space-y-2">
					<label className="text-sm font-medium">Select Page</label>
					<Select value={selectedPage} onValueChange={handlePageChange}>
						<SelectTrigger>
							<SelectValue placeholder="Choose a page" />
						</SelectTrigger>
						<SelectContent>
							{pages.map((page) => (
								<SelectItem key={page.page_id} value={page.page_id}>
									{page.page_name || "Untitled Page"}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				
				{/* Post Selection - Enhanced UI */}
				<div className="space-y-2">
					<label className="text-sm font-medium">Select Post</label>
					<PostSelector
						posts={posts}
						selectedPost={selectedPost}
						onSelectPost={handlePostChange}
						disabled={!selectedPage}
						placeholder={!selectedPage 
							? "Select a page first" 
							: loading 
								? "Loading posts..." 
								: posts.length === 0 
									? "No posts available" 
									: "Choose a post"
						}
					/>
					{error && <p className="text-xs text-red-500 mt-1">{error}</p>}
				</div>
			</div>

			{/* Comments Display Section - Enhanced UI */}
			{loading ? (
				<div className="flex items-center justify-center p-12">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
				</div>
			) : error ? (
				<div className="p-4 border border-red-200 bg-red-50 rounded-lg">
					<p className="text-red-700 text-sm">{error}</p>
				</div>
			) : (
				<div className="space-y-4">
					{!selectedPost ? (
						<EmptyState message="Select a page and post to view comments." />
					) : comments.length > 0 ? (
						<div>
							<div className="flex items-center justify-between mb-4">
								<h3 className="font-medium text-base sm:text-lg">Comments ({comments.length})</h3>
								<Button size="sm" variant="outline" onClick={() => fetchComments(selectedPost)}>
									<Clock className="h-3.5 w-3.5 mr-1.5" />
									Refresh
								</Button>
							</div>

							<AnimatePresence>
								<div className="grid gap-4">
									{comments.map((comment) => {
										const avatar = getAvatarForUser(comment.reply);
										const relativeTime = formatRelativeTime(comment.created_at);
										
										return (
											<motion.div
												key={comment.uniqueId || `${comment.comment_id}_${comment.id || Date.now()}`}
												initial={{ opacity: 0, y: 20 }}
												animate={{ opacity: 1, y: 0 }}
												exit={{ opacity: 0, scale: 0.95 }}
												transition={{ duration: 0.2 }}
											>
												<Card className="overflow-hidden border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
													<CardHeader className="p-4 pb-0 flex-row items-start justify-between gap-4">
														<div className="flex gap-3">
															<Avatar className={`h-9 w-9 ${avatar?.color || 'bg-gray-300'}`}>
																<AvatarFallback>{avatar?.initials || '?'}</AvatarFallback>
															</Avatar>
															
															<div>
																<div className="flex items-center gap-2">
																	<span className="font-semibold text-sm">
																		{comment.reply || 'Unknown User'}
																	</span>
																	
																	<TooltipProvider>
																		<Tooltip>
																			<TooltipTrigger asChild>
																				<Badge variant="outline" className="text-xs px-2 py-0 h-5">
																					{comment.type || 'Comment'}
																				</Badge>
																			</TooltipTrigger>
																			<TooltipContent side="top">
																				<p className="text-xs">Comment type</p>
																			</TooltipContent>
																		</Tooltip>
																	</TooltipProvider>
																</div>
																
																{relativeTime && (
																	<div className="flex items-center text-xs text-muted-foreground mt-0.5">
																		<Calendar className="h-3 w-3 mr-1" />
																		<span>{relativeTime}</span>
																		
																		{comment.likes > 0 && (
																			<>
																				<span className="mx-1">•</span>
																				<div className="flex items-center">
																					<ThumbsUp className="h-3 w-3 mr-1" />
																					<span>{comment.likes}</span>
																				</div>
																			</>
																		)}
																	</div>
																)}
															</div>
														</div>
														
														<TooltipProvider>
															<Tooltip>
																<TooltipTrigger asChild>
																	<Button
																		size="icon"
																		variant="ghost"
																		className="h-8 w-8 rounded-full"
																	>
																		<MoreHorizontal className="h-4 w-4" />
																		<span className="sr-only">Options</span>
																	</Button>
																</TooltipTrigger>
																<TooltipContent side="left">
																	<p className="text-xs">More options</p>
																</TooltipContent>
															</Tooltip>
														</TooltipProvider>
													</CardHeader>
													
													<CardContent className="p-4 pt-3">
														<p className="text-sm">{comment.content || 'No content'}</p>
													</CardContent>
													
													<CardFooter className="p-4 pt-0 flex justify-start">
														<Button 
															variant="ghost" 
															size="sm" 
															className="h-8 px-3 text-xs rounded-full"
															onClick={() => handleReply(comment)}
														>
															<Send className="h-3.5 w-3.5 mr-1.5" />
															Reply
														</Button>
													</CardFooter>
												</Card>
											</motion.div>
										);
									})}
								</div>
							</AnimatePresence>
						</div>
					) : (
						<EmptyState message="No comments found for this post." />
					)}
				</div>
			)}

			<ReplyDialog
				open={showReplyDialog}
				onOpenChange={setShowReplyDialog}
				comment={selectedComment}
				onSubmit={handleSubmitReply}
			/>
		</div>
	);
};