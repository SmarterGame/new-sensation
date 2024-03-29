import { RuleJson, TaskJson, VocabularyMetadata } from "@/types";
import { modifyTaskApi } from "@/utils/callKnownApi";
import { convertRuleToString } from "@/utils/convertRuleToString";
import { convertRuleJsonToRule } from "@/utils/fromApitoAppTypes";
import React from "react";
import { Bin } from "../Icons";
import { useCustomUserContext } from "@/app/context/userStore";

export function RuleBox(props: {
  task: TaskJson;
  rule: RuleJson;
  vocabularies_metadata: VocabularyMetadata[];
  reloadData: () => void;
}) {
  const { task, rule, vocabularies_metadata, reloadData } = props;
  const {accessToken} = useCustomUserContext();

  const getRuleName = () => {
    const res = convertRuleJsonToRule(rule, vocabularies_metadata);
    if (res.status !== "success")
      return `Error reading rule with id ${rule.id}`;
    return `${res.rule.name}: ${convertRuleToString(res.rule)}`;
  };

  return (
    <div className="flex border-t-2 border-solid border-black text-2xl w-full px-7">
      <p className="flex items-center px-7 w-11/12 mr-auto">{getRuleName()}</p>
      {/* <div
        className="h-16 p-3 cursor-pointer duration-75 ease-in-out hover:scale-110"
        onClick={() => {
          // TODO api
          // ? what should this api do
        }}
      >
        <Pen />
      </div> */}
      <div
        className="h-16 p-3 cursor-pointer duration-75 ease-in-out hover:scale-110"
        onClick={() => {
          const new_task: TaskJson = JSON.parse(JSON.stringify(task));
          new_task.rules = new_task.rules.filter((r) => r.id !== rule.id);
          modifyTaskApi(task, new_task, accessToken, reloadData);
        }}
      >
        <Bin />
      </div>
    </div>
  );
}
