import { createRouter } from "./context";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { validationSchema } from "~/pages/new-note";

const defaultNoteSelect = Prisma.validator<Prisma.NoteSelect>()({
  id: true,
  title: true,
  content: true,
});

export const notesRouter = createRouter()
  .query("byId", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      const { id } = input;
      return await ctx.prisma.note.findFirst({
        where: { id },
        select: defaultNoteSelect,
      });
    },
  })
  .query("getAll", {
    async resolve({ ctx }) {
      return await ctx.prisma.note.findMany({
        select: defaultNoteSelect,
      });
    },
  })
  .mutation("add", {
    input: validationSchema,
    async resolve({ ctx, input }) {
      return await ctx.prisma.note.create({
        data: input,
        select: defaultNoteSelect,
      });
    },
  });
