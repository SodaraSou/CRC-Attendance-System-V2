"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { parse, format } from "date-fns";
import { checkIn, checkOut } from "@/actions/attendance";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { useToast } from "./ui/use-toast";

export default function Profile({ user }: any) {
  const [attendance, setAttendance] = useState({});
  useEffect(() => {
    const today = new Date();
    const todayFormat = format(today, "yyyy-MM-dd");
    const prevDate = localStorage.getItem("date");

    if (prevDate !== todayFormat) {
      localStorage.setItem("attendance", JSON.stringify({}));
      localStorage.setItem("date", todayFormat);
      setAttendance({});
    } else {
      const attendanceString = localStorage.getItem("attendance");
      localStorage.setItem("date", todayFormat);
      if (attendanceString) {
        const attendanceObject = JSON.parse(attendanceString);
        setAttendance({ ...attendanceObject });
      }
    }
  }, []);
  const { toast } = useToast();
  const handleCheckIn = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const res = await checkIn();
    toast({
      variant: res.status === 200 ? "success" : "destructive",
      title: res.msg,
      duration: 20000,
    });
    if (res.status === 200) {
      localStorage.setItem("attendance", JSON.stringify(res.attendance));
      setAttendance({ ...res.attendance });
    }
  };
  const handleCheckOut = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const res = await checkOut();
    toast({
      variant: res.status === 200 ? "success" : "destructive",
      title: res.msg,
      duration: 20000,
    });
    if (res.status === 200) {
      localStorage.setItem("attendance", JSON.stringify(res.attendance));
      setAttendance({ ...res.attendance });
    }
  };

  const formatTime = (time: string) => {
    if (!time) return "-";
    const parsedTime = parse(time, "HH:mm:ss", new Date(0));
    return format(parsedTime, "hh:mm a");
  };

  if (!attendance) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <Image
          src={"/CRCHearderLogo.png"}
          alt="profileImg"
          width={500}
          height={500}
        />
      </CardHeader>
      <CardContent className="grid gap-4 text-[#362E8F]">
        <div className="flex justify-center gap-2 items-center">
          <h1 className="text-2xl font-semibold">ព័ត៌មានផ្ទាល់ខ្លួន</h1>
          {/* <button onClick={handleSignOut}>
            <LogOut className="h-4 w-4" />
          </button> */}
        </div>
        <div className="mx-auto">
          <img
            src={user.profileImg}
            alt="profileImg"
            width={128}
            height={128}
            className="object-cover"
          />
        </div>
        <form>
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div>
              <div className="text-xl">
                <Label htmlFor="username" className="text-lg font-semibold">
                  គោត្តនាម និងនាម
                </Label>
                <p className="text-[16px]">{user.username}</p>
              </div>
              <div className="text-xl">
                <Label htmlFor="name" className="text-lg font-semibold">
                  តួនាទី
                </Label>
                <p className="text-[16px]">{user.role}</p>
              </div>
              <div className="text-xl">
                <Label htmlFor="phone" className="text-lg font-semibold">
                  លេខទូរស័ព្ទ
                </Label>
                <p className="text-[16px]">{user.phoneNumber}</p>
              </div>
            </div>
            <div className="text-xl">
              <Label htmlFor="phone" className="text-lg font-semibold">
                វត្តមាន
              </Label>
              <>
                <p className="text-[16px]">ថ្ងៃទី {attendance.date}</p>
                <p className="text-[16px]">
                  ចូលទី១: {formatTime(attendance.checkInTimeMorning)}
                </p>
                <p className="text-[16px]">
                  ចេញទី១: {formatTime(attendance.checkOutTimeMorning)}
                </p>
                <p className="text-[16px]">
                  ចូលទី២: {formatTime(attendance.checkInTimeAfternoon)}
                </p>
                <p className="text-[16px]">
                  ចេញទី២: {formatTime(attendance.checkOutTimeAfternoon)}
                </p>
              </>
            </div>
          </div>
          {attendance.id !== "" ? (
            <div className="flex gap-4">
              <Button
                variant={"outline"}
                onClick={handleCheckIn}
                className="w-full bg-green-500 text-white"
              >
                ចុះវត្តមានចូល
              </Button>
              <Button
                variant={"outline"}
                onClick={handleCheckOut}
                className="w-full bg-[#e41820] text-white"
              >
                ចុះវត្តមានចេញ
              </Button>
            </div>
          ) : (
            <span className="w-full bg-green-500 text-white flex justify-center items-center h-10 px-4 py-2 rounded-md text-sm font-medium">
              ជោគជ័យ
            </span>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
