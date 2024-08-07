import {
  Block,
  Rule,
  RuleUnnested,
  VocabularyMetadata,
} from "@/types";
import { makeRuleNested } from "@/utils/makeRuleNested";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import RulePartBox from "./RulePartBox";
import { useCustomUserContext } from "@/app/context/userStore";
import { apiGet } from "@/services/api";

function checkBlocks(blocks: (Block | null)[], metas: VocabularyMetadata[]) {
  for (const block of blocks) {
    if (!block) continue;

    const meta = metas.findLast(m => m.name === block.vocabulary)?.blockMetadata[block.name]

    const blockParams = block.text.filter(t => t.type.includes("PARAM"));

    if (meta?.params.length !== blockParams.length) {
      throw new Error("Qualche primitiva non ha tutte le specifiche compilate!")
    }

    blockParams.forEach(param => {
      if ((param.type === "PARAM_INTEGER" || param.type === "PARAM_STRING" || param.type === "PARAM_OPEN_STRING") && param.value === null) {
        throw new Error("Qualche primitiva non ha tutte le specifiche compilate!")
      }
      if (param.type === "PARAM_CLASS" && param.choice === undefined) {
        throw new Error("Qualche primitiva non ha tutte le specifiche compilate!")
      }
    })
  }
}

export function CreateRuleMenu(props: {
  blocks: Block[];
  confirm_button_text: string;
  doSomethingWithRule: (rule: Rule) => void;
  extraDoOnReset?: () => void;
  vocabularies_metadata: VocabularyMetadata[];
  starting_values?: {
    id: string;
    name: string;
    whileArray: Block[];
    whenArray: Block[];
    doArray: Block[];
  };
}) {
  const {
    blocks,
    confirm_button_text,
    doSomethingWithRule,
    extraDoOnReset,
    starting_values,
    vocabularies_metadata,
  } = props;

  const [whileArray, setWhileArray] = useState<(Block | null)[]>(
    starting_values?.whileArray ?? [null]
  );
  const [whenArray, setWhenArray] = useState<(Block | null)[]>(
    starting_values?.whenArray ?? [null]
  );
  const [doArray, setDoArray] = useState<(Block | null)[]>(
    starting_values?.doArray ?? [null]
  );
  const [name, setName] = useState(starting_values?.name ?? "");
  
  const { accessToken } = useCustomUserContext();
  const [cachedMetadata, setCachedMetadata] = useState<any>({});

  useEffect(() => {
    const urls = new Set((blocks.map(b => {
      const labels = b.text.filter(t => t.type === "PARAM_OPEN_STRING" && t.label.type === "PARAM_OPEN_STRING" && !!t.label.url)

      if (labels.length > 0) {
        return labels.map(l => l.label.type === "PARAM_OPEN_STRING" && l.label.url);
      }

      return "";
    }).flatMap(e => e).filter(b => !!b) as string[]));

    urls.forEach(async url => {
      if (!cachedMetadata[url]) {
        const resp = await apiGet<string[]>(url, accessToken);
        if (resp.status === "success") {
          setCachedMetadata((prev: any) => {
            let copy = {...prev};
            if (resp.data) {
              copy[url] = resp.data;
            }
            return copy;
          });
        } else {
          console.error(resp.message);
        }
      }
    })
  }, [accessToken, blocks, cachedMetadata])

  function resetFields() {
    setWhenArray([null]);
    setWhileArray([null]);
    setDoArray([null]);
    setName("");
    if (extraDoOnReset) extraDoOnReset();
  }

  function makeRule() {
    if (!name) {
      Swal.fire("Specify rule name please", "", "error");
      return;
    }

    const rule_unnested: RuleUnnested = {
      name,
      when: whenArray.filter((x) => !!x) as Block[],
      while: whileArray.filter((x) => !!x) as Block[],
      do: doArray.filter((x) => !!x) as Block[],
      scope: "SELECTOR",
    };

    try {
      checkBlocks([...whenArray, ...whileArray, ...doArray], vocabularies_metadata);
      const rule = makeRuleNested(
        JSON.parse(JSON.stringify(rule_unnested)),
        blocks,
        vocabularies_metadata
      );
      if (starting_values?.id) rule.id = starting_values.id;
      doSomethingWithRule(rule);
      resetFields();
    } catch (e) {
      // @ts-ignore
      const message = e.message;
      Swal.fire("Some error in rule building", message, "error");
    }
  }

  return (
    <div className="w-11/12 mx-auto mt-10 flex flex-col">
      <label className="text-2xl">
         Rule name:
        <input
          className="border border-black px-2 mx-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>

      <div className="flex gap-10">
        <RulePartBox
          title="Event"
          text="AS SOON AS"
          blocks={blocks}
          array={whenArray}
          setArray={setWhenArray}
          type="STATE"
          scope="WHEN"
          single={true}
          cachedMetadata={cachedMetadata}
        />
        <RulePartBox
          title="State"
          text="WHILE"
          blocks={blocks}
          array={whileArray}
          setArray={setWhileArray}
          type="STATE"
          scope="WHILE"
          cachedMetadata={cachedMetadata}
        />
        <RulePartBox
          title="Action"
          text="THEN"
          blocks={blocks}
          array={doArray}
          setArray={setDoArray}
          type="ACTION"
          scope="ACTION"
          cachedMetadata={cachedMetadata}
        />
      </div>

      <div className="w-11/12 ml-auto flex justify-end gap-10 mt-20">
        <button
          onClick={() => resetFields()}
          className="text-white p-5 rounded-xl text-xl my-5 uppercase duration-100 ease-in-out hover:scale-105"
          style={{ backgroundColor: "#D73E3E" }}
        >
          Cancel
        </button>

        <button
          onClick={() => makeRule()}
          className="text-white bg-sky-500 p-5 rounded-xl text-2xl my-5 uppercase duration-100 ease-in-out hover:scale-105"
          style={{ backgroundColor: "#146AB9" }}
        >
          {confirm_button_text}
        </button>
      </div>
    </div>
  );
}
