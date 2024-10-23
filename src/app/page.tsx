import { redirect } from "next/navigation";
import { SubmitButton } from "./components/submit-button";
// import mammoth from "mammoth";

// Helper function to fetch the password from Google Drive (server-side)
async function getPassword(): Promise<string> {
  // const passwordUrl =
  //   "https://drive.google.com/uc?export=download&id=1PRslUyDxumOugGMSPlGlPlPtTgV8UWhP";

  const passwordUrl =
    "https://docs.google.com/document/d/18SAeYXDjC-dFWVE4X5q6ALUN06Km40cKYucOQBe7BCs/export?format=txt";

  const passwordResponse = await fetch(passwordUrl, { cache: "no-store" });

  if (!passwordResponse.ok) {
    throw new Error("Failed to fetch password");
  }

  const data = await passwordResponse.text();
  return data.trim(); // Trim any unnecessary whitespace
}

async function getMessage(): Promise<string | null> {
  // const messageUrl =
  //   "https://drive.google.com/uc?export=download&id=18ZakjpU1529d_FNCfWu1UE8m0imKnBzB";

  const messageUrl =
    "https://docs.google.com/document/d/1rhA3NaN7-Qt1ljf2tDYac6lOh1bYS8TiLVWCLpKXIrs/export?format=html";

  try {
    const messageResponse = await fetch(messageUrl, { cache: "no-store" });
    if (!messageResponse.ok) {
      throw new Error("Failed to fetch the message.");
    }

    let html = await messageResponse.text();

    html = html.replace(
      /<\/head>/,
      `<style>
        body, p, span, h1, h2, h3, h4, h5, h6, li {
          color: white !important;
        }
      </style></head>`
    );

    console.log("html", html);

    console.log("html", html);

    return html;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_err) {
    return null;
  }
}

// Server-side function to handle form submission and compare passkey
async function comparePasskeyForm(formData: FormData) {
  "use server";

  console.log("here?");

  const enteredPasskey = formData.get("passkey") as string;

  // Fetch the correct password from Google Drive
  const correctPassword = await getPassword();

  // Compare the entered passkey with the fetched password
  if (enteredPasskey.trim() === correctPassword) {
    // If the passkey matches, redirect to the message page
    redirect("/?password=" + enteredPasskey);
  } else {
    // If the passkey is incorrect, return an error message
    // return { error: "Invalid passkey. Please try again." };
    redirect("/?error=Invalid passkey. Please try again.");
  }
}

async function comparePasskeyAndGetMessage(password: string) {
  "use server";

  const enteredPasskey = password;

  // Fetch the correct password from Google Drive
  const correctPassword = await getPassword();

  // Compare the entered passkey with the fetched password
  if (enteredPasskey.trim() === correctPassword) {
    // If the passkey matches, redirect to the message page
    try {
      const message = await getMessage();
      return message;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_err) {
      return null;
    }
  } else {
    // If the passkey is incorrect, return an error message
    // return { error: "Invalid passkey. Please try again." };
    redirect("/?error=Invalid passkey. Please try again.");
  }
}

export default async function Home({
  searchParams,
}: {
  searchParams?: { error?: string; password?: string };
}) {
  const error = searchParams?.error;
  const password = searchParams?.password;

  let isAuthenticated = false;
  let message = "";

  if (password) {
    const result = await comparePasskeyAndGetMessage(password);
    if (result) {
      isAuthenticated = true;
      message = result;
    }
  }

  // {error && <p className="text-red-500 text-center mb-4">{error}</p>}

  return (
    <div className="flex w-full justify-center items-center min-h-screen bg-gray-900">
      {!isAuthenticated ? (
        <div className="w-full max-w-md p-8 bg-gray-800 rounded shadow-md">
          <h1 className="text-2xl font-bold text-center text-gray-100 mb-6">
            Enter Passkey
          </h1>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form
            action={comparePasskeyForm}
            // method="post"
            className="flex flex-col"
          >
            <input
              // type="password"
              name="passkey"
              placeholder="Enter your passkey"
              className="p-4 border border-gray-600 rounded bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out mb-4 placeholder-gray-400"
            />
            <SubmitButton />
          </form>
        </div>
      ) : (
        <div className="w-full max-w-3xl p-8 bg-gray-800 rounded shadow-md">
          <h1 className="text-2xl font-bold text-center text-gray-100 mb-6">
            Message
          </h1>
          <div className="message-container">
            <div
              className="message-content text-white"
              dangerouslySetInnerHTML={{ __html: message }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}
