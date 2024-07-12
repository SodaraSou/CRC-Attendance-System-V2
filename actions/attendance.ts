"use server";

import { db } from "@/db";
import { eq, and } from "drizzle-orm";
import { format, parse, isWithinInterval } from "date-fns";
import { attendanceTable } from "@/db/schema";
import { validateRequest } from "@/lib/validate-request";
import { generateIdFromEntropySize } from "lucia";

export async function checkIn() {
  const { user } = await validateRequest();
  if (!user) {
    return { status: 401, msg: "Unauthorized" };
  }

  const now = new Date();
  const currentTime = format(now, "HH:mm:ss");
  const currentDate = format(now, "yyyy-MM-dd");

  const currentTimeObj = parse(currentTime, "HH:mm:ss", new Date());
  const morningStart = parse("05:00:00", "HH:mm:ss", new Date());
  const morningEnd = parse("09:00:00", "HH:mm:ss", new Date());
  const afternoonStart = parse("13:00:00", "HH:mm:ss", new Date());
  const afternoonEnd = parse("15:00:00", "HH:mm:ss", new Date());

  const isMorningCheckIn = isWithinInterval(currentTimeObj, {
    start: morningStart,
    end: morningEnd,
  });
  const isAfternoonCheckIn = isWithinInterval(currentTimeObj, {
    start: afternoonStart,
    end: afternoonEnd,
  });

  if (!isMorningCheckIn && !isAfternoonCheckIn) {
    return {
      status: 400,
      msg: "Check-in is only allowed between 5-9 AM and 2-3 PM",
    };
  }

  const existingAttendance = await db
    .select()
    .from(attendanceTable)
    .where(
      and(
        eq(attendanceTable.userId, user.id),
        eq(attendanceTable.date, currentDate)
      )
    )
    .limit(1);

  let attendance;

  if (existingAttendance.length === 0) {
    const attendanceId = generateIdFromEntropySize(10);
    attendance = await db
      .insert(attendanceTable)
      .values({
        id: attendanceId,
        userId: user.id,
        date: currentDate,
        ...(isMorningCheckIn
          ? { checkInTimeMorning: currentTime }
          : { checkInTimeAfternoon: currentTime }),
      })
      .returning();
  } else {
    const existingRecord = existingAttendance[0];
    if (isMorningCheckIn && existingRecord.checkInTimeMorning) {
      return { status: 400, msg: "Already checked in for morning" };
    }
    if (isAfternoonCheckIn && existingRecord.checkInTimeAfternoon) {
      return { status: 400, msg: "Already checked in for afternoon" };
    }

    attendance = await db
      .update(attendanceTable)
      .set(
        isMorningCheckIn
          ? { checkInTimeMorning: currentTime }
          : { checkInTimeAfternoon: currentTime }
      )
      .where(eq(attendanceTable.id, existingRecord.id))
      .returning();
  }

  return {
    status: 200,
    msg: `User checked in for ${isMorningCheckIn ? "morning" : "afternoon"}`,
    attendance: {
      ...attendance[0],
      ...(isMorningCheckIn
        ? { checkInTimeMorning: currentTime }
        : { checkInTimeAfternoon: currentTime }),
    },
  };
}

export async function checkOut() {
  const { user } = await validateRequest();
  if (!user) {
    return { status: 401, msg: "Unauthorized" };
  }

  const now = new Date();
  const currentTime = format(now, "HH:mm:ss");
  const currentDate = format(now, "yyyy-MM-dd");

  const currentTimeObj = parse(currentTime, "HH:mm:ss", new Date());
  const morningCheckOutStart = parse("09:00:00", "HH:mm:ss", new Date());
  const morningCheckOutEnd = parse("13:00:00", "HH:mm:ss", new Date());
  const afternoonCheckOutStart = parse("15:00:00", "HH:mm:ss", new Date());
  const afternoonCheckOutEnd = parse("21:00:00", "HH:mm:ss", new Date());

  const isMorningCheckOut = isWithinInterval(currentTimeObj, {
    start: morningCheckOutStart,
    end: morningCheckOutEnd,
  });
  const isAfternoonCheckOut = isWithinInterval(currentTimeObj, {
    start: afternoonCheckOutStart,
    end: afternoonCheckOutEnd,
  });

  if (!isMorningCheckOut && !isAfternoonCheckOut) {
    return {
      status: 400,
      msg: "Check-out is only allowed between 11-1 PM and 4-9 PM",
    };
  }

  const existingAttendance = await db
    .select()
    .from(attendanceTable)
    .where(
      and(
        eq(attendanceTable.userId, user.id),
        eq(attendanceTable.date, currentDate)
      )
    )
    .limit(1);

  if (existingAttendance.length === 0) {
    return { status: 400, msg: "No check-in record found for today" };
  }

  const attendanceRecord = existingAttendance[0];

  let updateData = {};

  if (isMorningCheckOut) {
    if (attendanceRecord.checkOutTimeMorning) {
      return { status: 400, msg: "Already checked out for morning" };
    }
    if (attendanceRecord.checkInTimeMorning === null) {
      return {
        status: 400,
        msg: "Cannot check out for morning without checking in first",
      };
    }
    updateData = { checkOutTimeMorning: currentTime };
  } else {
    if (attendanceRecord.checkOutTimeAfternoon) {
      return { status: 400, msg: "Already checked out for afternoon" };
    }
    if (attendanceRecord.checkInTimeAfternoon === null) {
      return {
        status: 400,
        msg: "Cannot check out for afternoon without checking in first",
      };
    }
    updateData = { checkOutTimeAfternoon: currentTime };
  }

  const updatedAttendance = await db
    .update(attendanceTable)
    .set(updateData)
    .where(eq(attendanceTable.id, attendanceRecord.id))
    .returning();

  // return {
  //   status: 200,
  //   msg: `User checked out for ${isMorningCheckOut ? "morning" : "afternoon"}`,
  //   attendance: updatedAttendance[0],
  // };
  return {
    status: 200,
    msg: `User checked out for ${isMorningCheckOut ? "morning" : "afternoon"}`,
    attendance: {
      ...updatedAttendance[0],
      ...(isMorningCheckOut
        ? { checkOutTimeMorning: currentTime }
        : { checkOutTimeAfternoon: currentTime }),
    },
  };
}
