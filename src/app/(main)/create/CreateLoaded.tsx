import React from "react";
import { Block, Vocabulary } from "@/utils/BlockRuleTypes";
import CreateRuleMenu from "./CreateRuleMenu";
import VocabularyFilter from "../rules/VocabularyFilter";

export default function CreateLoaded(props: {
  vocabularies: Vocabulary[];
  blocks: Block[];
}) {
  const { vocabularies, blocks } = props;

  return (
    <main>
      <h1 className="w-11/12 mx-auto text-5xl font-semibold pt-12 pb-5">
        Regole
      </h1>
      <VocabularyFilter vocabularies={vocabularies} onChange={() => {}} />
      <CreateRuleMenu
        blocks={blocks}
        vocabularies={vocabularies}
        confirm_button_text="Crea regola"
        doSomethingWithRule={(rule) => {
          // TODO API
          alert(JSON.stringify(rule, null, 2));
        }}
      />
    </main>
  );
}