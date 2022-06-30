import Link from "next/link";

import { trpc } from "~/utils/trpc";

export function Layout({ children }: any) {
  const notes = trpc.useQuery(["notes.getAll"]);

  return (
    <div className="flex flex-row min-h-screen">
      <aside className="bg-gray-200 w-1/6 p-4 min-w-fit">
        <Link href="/new-note">
          <button
            type="button"
            className="w-full text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
          >
            Add Note
          </button>
        </Link>

        {!notes.data && <p>Loading...</p>}
        {notes.data && (
          <ul className="mt-8 space-y-2">
            {notes.data.map((note) => (
              <li key={note.id}>
                <Link href={`/notes/${note.id}`}>
                  <a>{note.title}</a>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </aside>
      <main className="w-5/6 p-4">{children}</main>
    </div>
  );
}
