import React, { useState, useEffect } from "react";
import { base44 } from "../services/base44";
import { Button, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/Primitives";
import { Card } from "../components/ui/Card";
import {
  Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, CreditCard,
  Smartphone, Plus, Loader2, TrendingUp, TrendingDown
} from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

export const Wallet = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const user = await base44.auth.me();
      const profiles = await base44.entities.UserProfile.filter({ user_email: user.email });
      
      if (profiles.length > 0) {
        setProfile(profiles[0]);
        
        const userTransactions = await base44.entities.Transaction.filter();
        setTransactions(userTransactions);
      }
    } catch (error) {
      console.error("Error loading wallet:", error);
    }
    setLoading(false);
  };

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    
    setActionLoading(true);
    try {
      const depositAmount = parseFloat(amount);
      
      await base44.entities.Transaction.create({
        user_id: profile.id,
        type: "deposit",
        amount: depositAmount,
        description: `Deposit via ${paymentMethod}`,
        payment_method: paymentMethod,
        status: "completed"
      });

      await base44.entities.UserProfile.update(profile.id, {
        wallet_balance: (profile.wallet_balance || 0) + depositAmount
      });

      setAmount("");
      setShowDeposit(false);
      await loadData();
    } catch (error) {
      console.error("Error depositing:", error);
    }
    setActionLoading(false);
  };

  const handleWithdraw = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    if (parseFloat(amount) > (profile.wallet_balance || 0)) {
      alert("Insufficient balance");
      return;
    }
    
    setActionLoading(true);
    try {
      const withdrawAmount = parseFloat(amount);
      
      await base44.entities.Transaction.create({
        user_id: profile.id,
        type: "withdrawal",
        amount: -withdrawAmount,
        description: `Withdrawal to ${paymentMethod}`,
        payment_method: paymentMethod,
        status: "completed"
      });

      await base44.entities.UserProfile.update(profile.id, {
        wallet_balance: (profile.wallet_balance || 0) - withdrawAmount
      });

      setAmount("");
      setShowWithdraw(false);
      await loadData();
    } catch (error) {
      console.error("Error withdrawing:", error);
    }
    setActionLoading(false);
  };

  const getTransactionIcon = (type: string) => {
    const isPositive = ["job_earning", "tool_rental_earning", "deposit"].includes(type);
    return isPositive ? (
      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
        <ArrowDownLeft className="w-5 h-5 text-green-600" />
      </div>
    ) : (
      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
        <ArrowUpRight className="w-5 h-5 text-red-600" />
      </div>
    );
  };

  const getTotalEarnings = () => {
    return transactions
      .filter(t => ["job_earning", "tool_rental_earning"].includes(t.type))
      .reduce((sum, t) => sum + (t.amount || 0), 0);
  };

  const getTotalSpent = () => {
    return Math.abs(transactions
      .filter(t => ["job_payment", "tool_rental_payment"].includes(t.type))
      .reduce((sum, t) => sum + (t.amount || 0), 0));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Wallet</h1>
        <p className="text-gray-500 text-sm">Manage your funds</p>
      </div>

      {/* Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="p-6 mb-6 bg-gradient-to-br from-emerald-500 to-emerald-700 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <WalletIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-emerald-100 text-sm">Available Balance</p>
              <p className="text-3xl font-bold">${(profile?.wallet_balance || 0).toFixed(2)}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => { setShowDeposit(true); setShowWithdraw(false); }}
              className="flex-1 bg-white/20 hover:bg-white/30 border-0"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Money
            </Button>
            <Button
              onClick={() => { setShowWithdraw(true); setShowDeposit(false); }}
              className="flex-1 bg-white/20 hover:bg-white/30 border-0"
            >
              <ArrowUpRight className="w-4 h-4 mr-2" />
              Withdraw
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-4 bg-green-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Earnings</p>
                <p className="text-xl font-bold text-green-600">${getTotalEarnings().toFixed(2)}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-4 bg-red-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Spent</p>
                <p className="text-xl font-bold text-red-600">${getTotalSpent().toFixed(2)}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Deposit/Withdraw Form */}
      {(showDeposit || showWithdraw) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-6 mb-6">
            <h3 className="font-semibold mb-4">
              {showDeposit ? "Add Money" : "Withdraw Funds"}
            </h3>
            <div className="space-y-4">
              <div>
                <Label>Amount ($)</Label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e: any) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="h-12 mt-1.5"
                />
              </div>
              
              <div>
                <Label>Payment Method</Label>
                {/* Simplified Select */}
                <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full h-12 rounded-lg border border-gray-200 px-3">
                    <option value="card">Credit/Debit Card</option>
                    <option value="mobile_money">Mobile Money</option>
                </select>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => { setShowDeposit(false); setShowWithdraw(false); setAmount(""); }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={showDeposit ? handleDeposit : handleWithdraw}
                  disabled={actionLoading || !amount}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                >
                  {actionLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : showDeposit ? (
                    "Add Money"
                  ) : (
                    "Withdraw"
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Transaction History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Transaction History</h3>
          
          {transactions.length > 0 ? (
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center gap-4 pb-4 border-b last:border-0 last:pb-0">
                  {getTransactionIcon(transaction.type)}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium capitalize truncate">
                      {transaction.type.replace(/_/g, " ")}
                    </p>
                    <p className="text-sm text-gray-500 truncate">{transaction.description}</p>
                    <p className="text-xs text-gray-400">
                      {transaction.created_date ? format(new Date(transaction.created_date), "MMM d, h:mm a") : ""}
                    </p>
                  </div>
                  <p className={`font-bold ${
                    transaction.amount > 0 ? "text-green-600" : "text-red-600"
                  }`}>
                    {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <WalletIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No transactions yet</p>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
}