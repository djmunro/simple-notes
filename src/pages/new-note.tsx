import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormProps } from "react-hook-form";
import { z } from "zod";
import { trpc } from "~/utils/trpc";

// validation schema is used by server
export const validationSchema = z.object({
  title: z.string().min(2),
  content: z.string().min(5),
});

function useZodForm<TSchema extends z.ZodType>(
  props: Omit<UseFormProps<TSchema["_input"]>, "resolver"> & {
    schema: TSchema;
  }
) {
  const form = useForm<TSchema["_input"]>({
    ...props,
    resolver: zodResolver(props.schema, undefined, {
      // This makes it so we can use `.transform()`s on the schema without same transform getting applied again when it reaches the server
      rawValues: true,
    }),
  });

  return form;
}

export default function NewNote() {
  const utils = trpc.useContext();

  const mutation = trpc.useMutation("notes.add", {
    async onSuccess() {
      await utils.invalidateQueries(["notes.getAll"]);
    },
  });

  const methods = useZodForm({
    schema: validationSchema,
    defaultValues: {
      title: "",
      content: "",
    },
  });

  return (
    <form
      onSubmit={methods.handleSubmit(async (values) => {
        await mutation.mutateAsync(values);
        methods.reset();
      })}
      className="space-y-2"
    >
      <div>
        <label>
          <p>Title</p>
          <input
            {...methods.register("title")}
            className="border rounded w-1/6"
          />
        </label>

        {methods.formState.errors.title?.message && (
          <p className="text-red-700">
            {methods.formState.errors.title?.message}
          </p>
        )}
      </div>
      <div>
        <label>
          <p>Content</p>
          <textarea
            {...methods.register("content")}
            className="border rounded w-1/4"
            rows={4}
          />
        </label>
        {methods.formState.errors.content?.message && (
          <p className="text-red-700">
            {methods.formState.errors.content?.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={mutation.isLoading}
        className="bg-orange-400 text-orange-800 px-4 py-2  rounded"
      >
        {mutation.isLoading ? "Loading" : "Submit"}
      </button>
    </form>
  );
}
