"use client";
import axios from "axios";
import dateFormat, { masks } from "dateformat";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

const actionUrl = process.env.NEXT_PUBLIC_API_LINK;

const PaidTable = () => {
  const [paids, setPaids] = useState([]);
  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    const { data } = await axios.get(`${actionUrl}/payments`);
    if (Array.isArray(data.response)) {
      setPaids(data.response);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex flex-row justify-between items-center">
            <span>Payments History</span>
            <Button onClick={loadPayments}>
              <RefreshCcw />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Method</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paids.map((paid) => (
              <TableRow key={paid.id}>
                <TableCell>{paid.userName}</TableCell>
                <TableCell>{paid.email}</TableCell>
                <TableCell>{paid.methodType}</TableCell>
                <TableCell className="text-right">{paid.amount}</TableCell>
                <TableCell className="text-right">{paid.status}</TableCell>
                <TableCell>
                  {dateFormat(paid.transactionTime, "ddd, mmm dd, yyyy, h:MM")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PaidTable;
