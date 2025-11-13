'use client';

import { useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useBalance } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { Loader2, Coins, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import contractInfo from '@/lib/contractInfo.json';
import { formatUnits, BaseError } from 'viem';

const faucetContract = {
  address: contractInfo.Faucet.address as `0x${string}`,
  abi: contractInfo.Faucet.abi,
};

const tokenContract = {
  address: contractInfo.CommunityToken.address as `0x${string}`,
  abi: contractInfo.CommunityToken.abi,
};

export function Faucet() {
  const { address, isConnected } = useAccount();
  const { toast } = useToast();

  const { data: hasClaimed, refetch: refetchHasClaimed } = useReadContract({
    ...faucetContract,
    functionName: 'hasClaimed',
    args: [address as `0x${string}`],
    query: {
      enabled: isConnected,
    },
  });

  const { data: balance, refetch: refetchBalance } = useBalance({
    address,
    token: tokenContract.address,
    query: {
        enabled: isConnected,
    },
  });

  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isConfirmed) {
      toast({
        title: "Claim Successful!",
        description: "10 COMM tokens have been sent to your wallet.",
        action: <CheckCircle className="text-green-500" />,
      });
      refetchHasClaimed();
      refetchBalance();
    }
    if(error){
      const errorMessage = error instanceof BaseError ? error.shortMessage : 'Transaction failed.';
      toast({
          title: "Claim Failed",
          description: errorMessage.includes("You have already claimed your tokens") 
            ? "You have already claimed your tokens." 
            : errorMessage,
          variant: "destructive",
      });
    }
  }, [isConfirmed, error, toast, refetchHasClaimed, refetchBalance]);

  const handleClaim = () => {
    if (contractInfo.Faucet.address === "0x0") {
        toast({
            title: "Contracts not deployed",
            description: "Please run the deployment script first.",
            variant: "destructive",
        });
        return;
    }
    writeContract({
      ...faucetContract,
      functionName: 'claim',
    });
  };

  const isClaimButtonDisabled = !!hasClaimed || isPending || isConfirming;

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Web3 Token Faucet</CardTitle>
        <CardDescription className="text-center">
          Get 10 free $COMM tokens on the local Hardhat network.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <ConnectButton />
        </div>
        {isConnected && (
          <div className="space-y-4 pt-4 text-center">
             <div className="p-3 bg-secondary rounded-lg">
                <p className="text-sm text-muted-foreground">Your Address</p>
                <p className="text-xs md:text-sm font-mono break-all">{address}</p>
            </div>
            <div className="p-3 bg-secondary rounded-lg">
                <p className="text-sm text-muted-foreground">Your $COMM Balance</p>
                <p className="text-lg font-bold">
                    {balance ? `${Number(formatUnits(balance.value, balance.decimals)).toFixed(2)} ${balance.symbol}` : '0.00 COMM'}
                </p>
            </div>
            {hasClaimed && (
                <div className="flex items-center justify-center p-3 bg-yellow-100 text-yellow-800 rounded-lg border border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-700/50">
                    <Info className="h-5 w-5 mr-2 flex-shrink-0" />
                    <p className="text-sm font-medium">You have already claimed your tokens.</p>
                </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        {isConnected && (
          <Button
            className={cn("w-full font-bold",
              !isClaimButtonDisabled && "bg-accent text-accent-foreground hover:bg-accent/90"
            )}
            size="lg"
            onClick={handleClaim}
            disabled={isClaimButtonDisabled}
          >
            {isPending || isConfirming ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : hasClaimed ? (
              'Tokens Claimed'
            ) : (
              'Claim 10 $COMM'
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
