import { getServerSession } from "next-auth";
import { getChatResponse } from "#services/chatService";
import { authOptions } from "#utils/helper/authHelper";

export async function POST(req: Request) {
	try {
		const { messages, restaurantId } = await req.json();
		if (!restaurantId) return Response.json({ text: "Restaurant ID is required", toolResults: [] }, { status: 400 });

		const session = await getServerSession(authOptions);
		if (!session) return Response.json({ text: "Please login to chat with Jarvis", toolResults: [] }, { status: 401 });

		const result = await getChatResponse(messages, restaurantId, session?.customer?.fname);
		return Response.json(result);
	} catch (error) {
		console.error("Error in AI Chat API:", error);
		return Response.json({ text: "I apologize, but I'm having trouble connecting right now. Please try again.", toolResults: [] }, { status: 500 });
	}
}
