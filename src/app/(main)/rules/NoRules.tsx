import DocumentPlus from "@/svg/DocumentPlus";
import { links } from "@/utils/links";
import React from "react";

export default function NoRules() {
  return (
    <div className="flex flex-col items-center w-1/2 mt-24 mx-auto">
      <div className="h-80 mb-10">
        <DocumentPlus />
      </div>
      <h2 className="font-bold text-6xl mb-10">Nessuna regola creata</h2>
      <p className="text-4xl mb-10">
        Crea nuove regole per far giocare i tuoi studenti con SMARTER e
        SmartGame
      </p>
      <a href="./create">
        <button className="bg-sky-400 text-4xl text-white px-10 py-5 ease-in-out duration-75 hover:bg-sky-500 rounded-xl">
          {links.create}
        </button>
      </a>
    </div>
  );
}