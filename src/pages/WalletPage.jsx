import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Plus,
  Loader2,
  TrendingUp,
  TrendingDown,
  RefreshCw
} from "lucide-react";
import { useBoom } from "@/contexts/BoomContext";
import { useNavigate } from "react-router-dom";

export function WalletPage() {
  const navigate = useNavigate();
  const { walletData, walletHistory, loadingWallet, getWallet, fundWallet } = useBoom();

  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showTopUp, setShowTopUp] = useState(false);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    getWallet();
  }, [getWallet]);

  const presetAmounts = [1000, 5000, 10000, 25000];

  const handleTopUp = async (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;
    
    setIsProcessing(true);
    try {
      const result = await fundWallet(amount);
      
      if (result) {
        console.log('Payment checkout successful:', result);
        
        // If the API returns a payment URL, you might want to redirect to it
        if (result.payment_url || result.checkout_url || result.url) {
          const paymentUrl = result.payment_url || result.checkout_url || result.url;
          console.log('Redirecting to payment URL:', paymentUrl);
          window.open(paymentUrl, '_blank');
        }
        
        // Refresh wallet data after successful checkout initiation
        await getWallet();
        setAmount("");
        setShowTopUp(false);
      }
    } catch (error) {
      console.error('Top up failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (loadingWallet && !walletData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-2xl font-medium text-gray-900">Wallet</h1>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            onClick={getWallet}
            disabled={loadingWallet}
          >
            <RefreshCw size={18} className={loadingWallet ? "animate-spin" : ""} />
          </Button>
        </div>

        {/* Balance */}
        <div className="text-center mb-12">
          <p className="text-sm text-gray-500 mb-2">Available Balance</p>
          <motion.p
            key={walletData}
            initial={{ opacity: 0.8, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-5xl font-light text-gray-900 mb-8"
          >
            {walletData ? formatCurrency(walletData) : '₦0'}
          </motion.p>
          
          <Button
            onClick={() => setShowTopUp(!showTopUp)}
            className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-full"
          >
            <Plus size={16} className="mr-2" />
            Add Money
          </Button>
        </div>

        {/* Top Up Form */}
        {showTopUp && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <Card className="border-0 shadow-sm">
              <CardContent className="p-8">
                <form onSubmit={handleTopUp} className="space-y-6">
                  <div>
                    <Label className="text-sm text-gray-600 mb-4 block">
                      Quick amounts
                    </Label>
                    <div className="grid grid-cols-4 gap-3 mb-6">
                      {presetAmounts.map((preset) => (
                        <Button
                          key={preset}
                          type="button"
                          variant="outline"
                          className="border-gray-200 text-gray-700 hover:bg-gray-50 py-3"
                          onClick={() => setAmount(preset.toString())}
                        >
                          ₦{preset/1000}k
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm text-gray-600 mb-2 block">
                      Custom amount
                    </Label>
                    <Input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="border-gray-200 py-3 text-lg"
                      placeholder="Enter amount"
                      min="100"
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 border-gray-200 text-gray-700"
                      onClick={() => setShowTopUp(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-gray-900 hover:bg-gray-800 text-white"
                      disabled={isProcessing || !amount}
                    >
                      {isProcessing ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        'Add Money'
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Transaction History */}
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-6">Recent Activity</h2>
          
          {walletHistory && walletHistory.length > 0 ? (
            <div className="space-y-1">
              {walletHistory.slice(0, 5).map((transaction, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-4 px-4 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      transaction.debit_amount > 0 
                        ? 'bg-red-50 text-red-600' 
                        : 'bg-green-50 text-green-600'
                    }`}>
                      {transaction.debit_amount > 0 ? (
                        <TrendingDown size={14} />
                      ) : (
                        <TrendingUp size={14} />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{transaction.transaction_type.toUpperCase()}</p>
                      <p className="text-xs text-gray-500">{formatDate(transaction.created_at)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium text-sm ${
                      transaction.debit_amount > 0 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {transaction.debit_amount > 0 ? '-' : '+'}
                      {formatCurrency(Math.abs(transaction.debit_amount))}
                    </p>
                  </div>
                </div>
              ))}
              
              {walletHistory.length > 5 && (
                <div className="text-center pt-4">
                  <Button variant="ghost" className="text-sm text-gray-500">
                    View all transactions
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-gray-500">No transactions yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 