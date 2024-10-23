async function getData() {
  try {
    const url =
      "https://drive.google.com/uc?export=download&id=18ZakjpU1529d_FNCfWu1UE8m0imKnBzB";

    const messageResponse = await fetch(url, { cache: "no-store" });

    if (!messageResponse.ok) {
      throw new Error("Failed to fetch the message.");
    }

    const data = await messageResponse.text();

    return data;
  } catch (_err) {
    console.log(_err);
    return null;
  }
}

export default async function Home() {
  const data = await getData();

  if (!data) {
    return (
      <div className="flex justify-center min-h-screen bg-gray-900">
        <p className="text-white text-lg">Failed to load the message.</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-3xl p-8 bg-gray-800 rounded shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-100 mb-6">
          Message
        </h1>

        <div
          className="text-gray-100 text-lg leading-relaxed"
          dangerouslySetInnerHTML={{ __html: data }}
        ></div>
      </div>
    </div>
  );
}
