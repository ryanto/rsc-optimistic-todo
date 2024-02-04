import Cards from "./cards";

let cards = [
  {
    id: crypto.randomUUID(),
    title: "Test card #1",
    createdAt: new Date(),
  },
];

export type Card = (typeof cards)[number];

async function addCard(formData: FormData) {
  "use server";

  await new Promise((resolve) => setTimeout(resolve, 1500));

  let id = formData.get("id") as ReturnType<typeof crypto.randomUUID>;
  let title = formData.get("title") as string;
  let createdAtString = formData.get("createdAt") as string;
  let createdAt = new Date(createdAtString);

  if (Math.random() < 0.5) {
    cards.push({ id, title, createdAt });
  }
}

export default async function Page() {
  return (
    <div className="mx-auto max-w-sm sm:mx-0 sm:max-w-none">
      <h1 className="text-5xl font-black tracking-tighter">RSC Optimistic</h1>
      <div className="mt-1">
        <Cards cards={cards} addAction={addCard} />
      </div>
    </div>
  );
}
