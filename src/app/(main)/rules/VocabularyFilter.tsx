import { Vocabulary } from "@/types";
import React, { useEffect, useState } from "react";

type VocabularyChoice = "SMARTER" | "SMARTER e SmartGame";

function VocabularyFilterHardCoded(props: {
  vocabularies: Vocabulary[];
  onChange: (choice: VocabularyChoice) => void;
}) {
  const { vocabularies, onChange } = props;
  const necessary_vocabulary_1 = "SMARTER";
  const necessary_vocabulary_2 = "SmartGame";
  const choice_vocabulary_1: VocabularyChoice = "SMARTER";
  const choice_vocabulary_2: VocabularyChoice = "SMARTER e SmartGame";

  useEffect(() => {
    const first_radio = document.getElementById(
      choice_vocabulary_1
    ) as HTMLInputElement;
    first_radio.checked = true;
    onChange(choice_vocabulary_1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (
    !vocabularies.includes(necessary_vocabulary_1) ||
    !vocabularies.includes(necessary_vocabulary_2)
  )
    return (
      <div className="w-11/12 mx-auto text-2xl py-5">
        NOT THE NECESSARY VOCABULARIES FOR SMARTER
      </div>
    );

  return (
    <div className="w-11/12 mx-auto text-2xl py-5 flex gap-10">
      <label className="flex gap-5">
        <input
          type="radio"
          id={choice_vocabulary_1}
          name="choice"
          value={choice_vocabulary_1}
          className="scale-150 -z-10"
          onChange={(e) => onChange(e.target.value as VocabularyChoice)}
        />
        {choice_vocabulary_1}
      </label>

      <label className="flex gap-5">
        <input
          type="radio"
          id={choice_vocabulary_2}
          name="choice"
          value={choice_vocabulary_2}
          className="scale-150 -z-10"
          onChange={(e) => onChange(e.target.value as VocabularyChoice)}
        />
        {choice_vocabulary_2}
      </label>
    </div>
  );
}

export default function VocabularyFilter(props: {
  vocabularies: Vocabulary[];
  // onChange: (choice: VocabularyChoice) => void;
  onChange: (choices: Vocabulary[]) => void;
}) {
  const { vocabularies, onChange } = props;
  const [selected_vocabularies, setSelectedVocabularies] =
    useState(vocabularies);

  useEffect(() => {
    onChange(selected_vocabularies);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected_vocabularies]);

  return (
    <div className="w-11/12 mx-auto text-2xl py-5">
      {vocabularies.map((v) => {
        const checked = selected_vocabularies.some((sv) => sv === v);
        return (
          <label key={v} className="flex gap-5">
            <input
              type="checkbox"
              value={v}
              className="scale-150 -z-10"
              checked={checked}
              onChange={() => {
                if (checked)
                  setSelectedVocabularies((prev) =>
                    prev.filter((sv) => sv !== v)
                  );
                else setSelectedVocabularies((prev) => [...prev, v]);
              }}
            />
            {v}
          </label>
        );
      })}
    </div>
  );

  // return <VocabularyFilterHardCoded {...props} />;
}
