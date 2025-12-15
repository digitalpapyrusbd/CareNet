import { DollarSign, TrendingUp, Calendar, Download, ArrowUpRight, Wallet } from "lucide-react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";

interface Transaction {
  id: number;
  type: "earned" | "withdrawn" | "pending";
  amount: number;
  description: string;
  date: string;
  status: "completed" | "pending" | "processing";
}

interface EarningsProps {
  onNavigate: (page: string) => void;
}

export function Earnings({ onNavigate }: EarningsProps) {
  const currentBalance = 12500;
  const thisMonthEarnings = 18400;
  const pendingPayments = 3500;
  const lastMonthEarnings = 15600;

  const transactions: Transaction[] = [
    {
      id: 1,
      type: "earned",
      amount: 1500,
      description: "Post-Surgery Care - Mrs. Rahman",
      date: "Dec 3, 2024",
      status: "completed",
    },
    {
      id: 2,
      type: "pending",
      amount: 1200,
      description: "Diabetes Management - Mr. Hossain",
      date: "Dec 2, 2024",
      status: "pending",
    },
    {
      id: 3,
      type: "withdrawn",
      amount: -5000,
      description: "Bank Transfer to bKash",
      date: "Dec 1, 2024",
      status: "completed",
    },
    {
      id: 4,
      type: "earned",
      amount: 2000,
      description: "Elderly Care - Mrs. Khan",
      date: "Nov 30, 2024",
      status: "completed",
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <h1 className="mb-1">Earnings</h1>
        <p className="text-sm text-muted-foreground">Track your income and withdrawals</p>
      </div>

      {/* Balance Card */}
      <div className="px-6 mb-6">
        <Card className="modern-card p-6 border-0">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Available Balance</p>
              <h1 className="number-display">৳{currentBalance.toLocaleString()}</h1>
            </div>
            <div className="w-14 h-14 btn-icon-neumorphic">
              <Wallet className="w-7 h-7 text-primary" />
            </div>
          </div>
          
          <button className="btn-neumorphic-primary w-full py-3">
            <Download className="w-4 h-4 mr-2" />
            Withdraw Funds
          </button>
        </Card>
      </div>

      {/* Stats Grid */}
      <div className="px-6 mb-6">
        <div className="grid grid-cols-2 gap-3">
          <Card className="modern-card p-4 border-0">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 btn-icon-neumorphic">
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground">This Month</p>
            </div>
            <p className="text-xl number-display">৳{thisMonthEarnings.toLocaleString()}</p>
            <p className="text-xs text-primary mt-1 flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" />
              +{Math.round(((thisMonthEarnings - lastMonthEarnings) / lastMonthEarnings) * 100)}% from last month
            </p>
          </Card>

          <Card className="modern-card p-4 border-0">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 btn-icon-neumorphic">
                <Calendar className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
            <p className="text-xl number-display">৳{pendingPayments.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">
              2 payments processing
            </p>
          </Card>
        </div>
      </div>

      {/* Monthly Overview */}
      <div className="px-6 mb-6">
        <Card className="modern-card p-5 border-0">
          <h3 className="mb-4">Monthly Breakdown</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Earned</span>
              <span className="number-display">৳{thisMonthEarnings.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Withdrawn</span>
              <span className="number-display">৳5,000</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Pending</span>
              <span className="number-display text-muted-foreground">৳{pendingPayments.toLocaleString()}</span>
            </div>
            <div className="pt-3 border-t border-border/50 flex items-center justify-between">
              <span className="font-medium">Available</span>
              <span className="number-display text-primary">৳{currentBalance.toLocaleString()}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Transaction History */}
      <div className="px-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3>Recent Transactions</h3>
          <button className="text-sm text-primary">View All</button>
        </div>

        <div className="space-y-2">
          {transactions.map((transaction) => (
            <Card key={transaction.id} className="modern-card p-4 border-0">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`w-10 h-10 rounded-full btn-icon-neumorphic flex items-center justify-center flex-shrink-0 ${
                    transaction.type === 'earned' ? 'text-primary' : 
                    transaction.type === 'pending' ? 'text-muted-foreground' : 
                    'text-destructive'
                  }`}>
                    {transaction.type === 'earned' ? (
                      <TrendingUp className="w-5 h-5" />
                    ) : transaction.type === 'pending' ? (
                      <Calendar className="w-5 h-5" />
                    ) : (
                      <Download className="w-5 h-5" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium mb-0.5">{transaction.description}</p>
                    <p className="text-xs text-muted-foreground">{transaction.date}</p>
                    {transaction.status === "pending" && (
                      <Badge className="btn-neumorphic text-xs px-2 py-0.5 mt-1">
                        Pending
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="text-right flex-shrink-0 ml-3">
                  <p className={`number-display ${
                    transaction.amount > 0 ? 'text-primary' : 'text-destructive'
                  }`}>
                    {transaction.amount > 0 ? '+' : ''}৳{Math.abs(transaction.amount).toLocaleString()}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
