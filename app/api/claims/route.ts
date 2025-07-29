import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function setCorsHeaders(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}

export async function OPTIONS() {
  const response = NextResponse.json({}, { status: 200 });
  return setCorsHeaders(response);
}

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
    return setCorsHeaders(NextResponse.json({ success: true, claim }));
  } catch (error) {
    let message = "Unknown error";
    if (error instanceof Error) message = error.message;
    return setCorsHeaders(NextResponse.json({ success: false, error: message }, { status: 500 }));
  }
}

export async function GET() {
  try {
    const claims = await prisma.claims.findMany({
      orderBy: { claimID: "asc" }
    });
    return setCorsHeaders(NextResponse.json(claims));
  } catch (error) {
    let message = "Unknown error";
    if (error instanceof Error) message = error.message;
    return setCorsHeaders(NextResponse.json({ success: false, error: message }, { status: 500 }));
  }
}
