import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client/edge";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const claim = await prisma.claims.create({
      data: {
        claimID: body.claimID,
        claimType: body.claimType,
        Priority: body.Priority,
        Description: body.Description,
        createdOn: new Date(body.createdOn)
      }
    });
    return NextResponse.json({ success: true, claim });
  } catch (error) {
    let message = "Unknown error";
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const claims = await prisma.claims.findMany({
      orderBy: { claimID: "asc" }
    });
    return NextResponse.json(claims);
  } catch (error) {
    let message = "Unknown error";
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
