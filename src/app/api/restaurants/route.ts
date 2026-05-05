import { NextResponse } from "next/server";
import prisma from "#utils/database/connect";
import { CatchNextResponse } from "#utils/helper/common";

export async function GET() {
  try {
    const restaurants = await prisma.account.findMany({
      where: { accountActive: true, verified: true },
      select: {
        username: true,
        profile: {
          select: {
            name: true,
          }
        },
        tables: {
          select: {
            name: true,
            username: true,
          }
        }
      }
    });

    return NextResponse.json(restaurants);
  } catch (err) {
    console.log(err);
    return CatchNextResponse(err);
  }
}
