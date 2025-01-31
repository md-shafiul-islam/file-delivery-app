"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PaymentElementCard from "@/components/Dashboard/Payment/PaymentElementCard";
import PaidTable from "@/components/Dashboard/Payment/PaidTable";
const PaymentTab = () => {
  return (
    <div>
      <Tabs defaultValue="payments" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="payments">Completed Payments</TabsTrigger>
          <TabsTrigger value="paid">Paid</TabsTrigger>
        </TabsList>
        <TabsContent value="payments">
          <PaidTable />
        </TabsContent>
        <TabsContent value="paid">
          <PaymentElementCard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PaymentTab;
