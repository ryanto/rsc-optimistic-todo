"use client";

import { useOptimistic, useRef, useState } from "react";
import { Card } from "./index.page";
import { Check, Spinner } from "./icons";

type OptimisticCard = Card & { pending?: boolean };

export default function Cards({
  cards,
  addAction,
}: {
  cards: Card[];
  addAction: (formData: FormData) => Promise<void>;
}) {
  let formRef = useRef<HTMLFormElement>(null);

  let [optimisticCards, setOptimisticCards] =
    useOptimistic<OptimisticCard[]>(cards);
  let [addedCards, setAddedCards] = useState<OptimisticCard[]>([]);

  let failedCards = addedCards.filter(
    (card) => !optimisticCards.some((oc) => oc.id === card.id),
  );
  let successfulCards = addedCards.filter((card) =>
    optimisticCards.some((oc) => oc.id === card.id && !oc.pending),
  );

  function cardDidSave(card: OptimisticCard) {
    return successfulCards.some((c) => c.id === card.id);
  }

  function cardFailedSave(card: OptimisticCard) {
    return failedCards.some((c) => c.id === card.id);
  }

  let listedCards = [...optimisticCards, ...failedCards];

  async function formAction(formData: FormData) {
    let newCard = {
      id: crypto.randomUUID(),
      title: formData.get("title") as string,
      createdAt: new Date(),
      pending: true,
    };

    setOptimisticCards((cards) => [...cards, newCard]);
    setAddedCards((cards) => [...cards, newCard]);

    formRef.current?.reset();

    formData.append("id", newCard.id);
    formData.append("createdAt", newCard.createdAt.toISOString());
    await addAction(formData);
  }

  async function retrySave(card: OptimisticCard) {
    setOptimisticCards((cards) => [...cards, card]);

    let formData = new FormData();
    formData.append("id", card.id);
    formData.append("title", card.title);
    formData.append("createdAt", card.createdAt.toISOString());

    await addAction(formData);
  }

  let sortedCards = listedCards.sort(
    (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
  );

  return (
    <div className="max-w-xs rounded border border-gray-200 bg-gray-100 p-4 shadow">
      <h2 className="text-sm font-semibold text-gray-900">Cards</h2>
      <ul className="mt-4 space-y-2">
        {sortedCards.map((card) => (
          <li
            key={card.id}
            className="rounded border border-gray-300 bg-white p-3 text-gray-950 shadow"
          >
            <div className="flex items-center justify-between">
              <span>{card.title}</span>
              {cardFailedSave(card) ? (
                <form action={() => retrySave(card)} className="ml-2">
                  <button className="text-xs text-red-600" type="submit">
                    Failed - Retry
                  </button>
                </form>
              ) : card.pending ? (
                <Spinner className="size-3 animate-spin text-gray-500" />
              ) : cardDidSave(card) ? (
                <Check className="size-4 text-green-500" />
              ) : null}
            </div>
          </li>
        ))}
      </ul>
      <form action={formAction} ref={formRef} className="mt-2">
        <input
          type="text"
          name="title"
          placeholder="Enter a card title..."
          className="w-full rounded border border-gray-300 p-2 text-black"
          autoFocus
        />
        <div className="mt-3">
          <button
            type="submit"
            className="rounded bg-blue-600 px-4 py-2 text-white"
          >
            Add card
          </button>
        </div>
      </form>
    </div>
  );
}
