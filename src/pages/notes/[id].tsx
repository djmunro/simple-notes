import NextError from "next/error";
import { useRouter } from "next/router";
import { trpc } from "~/utils/trpc";

export default function Note() {
  const id = useRouter().query.id as string;
  const noteQuery = trpc.useQuery(["notes.byId", { id }]);

  if (noteQuery.error) {
    return (
      <NextError
        title={noteQuery.error.message}
        statusCode={noteQuery.error.data?.httpStatus ?? 500}
      />
    );
  }

  if (noteQuery.status !== "success") {
    return <p>Loading...</p>;
  }

  const { data } = noteQuery;

  return (
    <>
      <h1 className="text-3xl text-rose-500">{data?.title}</h1>
      <p className="mt-2">{data?.content}</p>
    </>
  );
}
