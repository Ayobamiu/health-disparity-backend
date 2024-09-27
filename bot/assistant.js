const { openai } = require("./openaiConfig");
const { db } = require("../firebase/config");

/**
 * Step 1: Create an Assistant
 * (Skipping this now, assitant has been created manually on OpenAI dashboard)
 */

// export async function CreateAssistant() {}

/* Step 2: Create a Thread
 */
async function checkOrCreateThread(type, email) {
  try {
    // Initialize default thread document structure
    let threadDoc = {
      email,
      threads: {},
    };

    // Reference to the thread document in Firestore
    const docRef = db.collection("thread").doc(email);
    const docSnap = await docRef.get();

    // Check if the document exists
    if (docSnap.exists) {
      threadDoc = docSnap.data();
    }

    // If thread for the specific type exists, return the thread ID
    if (!threadDoc.threads[type]) {
      // Create a new thread using OpenAI API
      const thread = await openai.beta.threads.create();
      threadDoc.threads[type] = thread.id;

      // Save updated thread data in Firestore
      const newDocRef = db.collection("thread").doc(email);
      await newDocRef.set(threadDoc);
    }

    return threadDoc;
  } catch (error) {
    console.error("Error checking or creating thread:", error);
    return null;
  }
}

/* Step 3: Add a Message to the Thread
 */
async function addMessage(threadId, content) {
  const response = await openai.beta.threads.messages.create(threadId, {
    role: "user",
    content,
  });
  return response;
}

/* Step 4: Create a Run
 */
async function createRun(threadId, assistantId, instructions) {
  let run = await openai.beta.threads.runs.createAndPoll(threadId, {
    assistant_id: assistantId,
    instructions,
  });
  if (run.status === "completed") {
    const messages = await openai.beta.threads.messages.list(run.thread_id);
    return messages;
  } else {
    return null;
  }
}

//thread_QFnMcoKUMTrNVfOESFi0pgMT
async function getExistingMessages(threadId) {
  // Fetch messages from the thread without creating a new run
  let response = await openai.beta.threads.messages.list(threadId);
  if (response.data) {
    return response.data;
  }
  return null; // Return null if no messages exist
}
module.exports = {
  checkOrCreateThread,
  addMessage,
  createRun,
  getExistingMessages,
};
