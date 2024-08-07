import React, { useMemo, useState } from "react";
import { CardTypes, Exercise, ExerciseLevel, Game, GamificationModes, GamificationModesMapping } from "../Element/types";
import { Bin, Copy, Pen, Puzzle } from "../Icons";
import { useCustomUserContext } from "@/app/context/userStore";
import { UpArrow } from "../Icons/UpArrow";
import { DownArrow } from "../Icons/DownArrow";
import { NoElementMenu } from "../Menu";

export function LevelBox(props: {
  children: React.ReactNode;
  numLevel: number;
  isLast?: boolean;
  isFirst?: boolean;
}) {
  const { children, isLast = false, isFirst = false, numLevel } = props;
  const {accessToken} = useCustomUserContext();
  const [open, setOpen] = useState(false);

  return (
    <article className="w-full select-none">
      <div
        onClick={() => setOpen(prev => !prev)}
        className={"flex cursor-pointer border-2 border-gray-500"+ (isLast || open ? "" : " border-b-0") + (isFirst ? " rounded-t-lg" : "" ) + " items-center justify-between p-2"}
      >
        <h4 className="font-semibold lg:text-lg">{"Livello "+(numLevel)}</h4>
        {open ? (
          <UpArrow/>
        ) : (
          <DownArrow/>
        )}
      </div>
      {open && (
        <div className="leading-[21px]">
          {children}
        </div>
      )}
    </article>
  );
}

export function ExerciseCard(props: {
  exercise_modify: string
  game: Omit<Game, "_id">
  numLevel: number
  numExercise: number
  setGame: React.Dispatch<React.SetStateAction<Omit<Game, "_id">>>
  setExerciseModifying: React.Dispatch<React.SetStateAction<string>>
}) {
  const { game, numExercise, numLevel, exercise_modify, setExerciseModifying, setGame } = props;
  const mode = useMemo(() => game.levels[numLevel].mode, [game.levels, numLevel])

  return (
    <div className="h-full m-4">
      <div className="flex h-full w-full border border-gray-500 rounded-md justify-between">
        <div className="flex min-h-full bg-[#87C4FD] text-white text-3xl p-6 rounded-l-md items-center">
          <div className="">{numExercise+1}</div>
        </div>
        <div className="flex flex-col min-h-full text-lg p-2 justify-center">
          <div>Assignment: {game.levels[numLevel].exercises[numExercise].assignment}</div>
          <div>Starting situation: {game.levels[numLevel].exercises[numExercise].startSeq.join(" ")} Solution: {game.levels[numLevel].exercises[numExercise].endSeq?.join(" ")}</div>
        </div>
        <div className="w-[15%] flex">
            <div
              onClick={() => setExerciseModifying(mode+"-"+numLevel+"-"+numExercise)}
              className="cursor-pointer duration-75 ease-in-out hover:scale-110"
            >
              <Pen />
            </div>
            <div
              onClick={() => {
                setGame(prev => {
                  let execs = prev.levels[numLevel].exercises
                  execs.push(game.levels[numLevel].exercises[numExercise])
                  prev.levels[numLevel].exercises = execs
                  return {...prev};
                })
              }}
              className="cursor-pointer duration-75 ease-in-out hover:scale-110"
            >
              <Copy />
            </div>
            <div
              onClick={() => {
                setGame(prev => {
                  let execs = prev.levels[numLevel].exercises;
                  execs.splice(numExercise,1);
                  prev.levels[numLevel].exercises = execs;
                  return {...prev};
                })
              }}
              className="cursor-pointer duration-75 ease-in-out hover:scale-110"
            >
              <Bin />
            </div>
          </div>
      </div>
      {exercise_modify === mode+"-"+numLevel+"-"+numExercise && (
        <DetailForm
          initial_detail={game.levels[numLevel].exercises[numExercise]} 
          onSave={(exec) => {
            setGame(prev => { 
              prev.levels[numLevel].exercises[numExercise] = exec;
              return {...prev}
            })
            setExerciseModifying("")
          }
          } 
          onCancel={() => setExerciseModifying("")}
        />
      )}
    </div>
  )
}

export function GameLevelDefinition(props: {
  game: Omit<Game, "_id">;
  setGame: React.Dispatch<React.SetStateAction<Omit<Game, "_id">>>;
  modes: GamificationModes[];
}) {
  const { setGame, modes, game } = props;
  const [mode, setMode] = useState(modes[0]);
  const [exercise_level_modifying, setExerciseLevelModifying] = useState("");
  const filteredLevels = useMemo(() => game.levels.filter(elem => elem.mode === GamificationModesMapping[mode]), [game, mode])
  const mapper = useMemo(() => Object.fromEntries(game.levels.filter(elem => elem !== undefined).map((elem,index) => [elem.mode+"-"+elem.n,index])), [game]) // TODO: indaga perchè a volte potrebbe rompersi

  const ButtonComponent = () => {
    return (
      <>
        <button 
          onClick={addNewLevel}
          className="uppercase bg-sky-400 text-xl text-white px-5 py-5 ease-in-out duration-75 hover:bg-sky-500 rounded-xl"
        >
          Create a level
        </button>
      </>
      
    )
  }

  function addNewLevel() {
    setGame(prev => {
      let gameModify = {...prev};
      gameModify.levels.push({n: filteredLevels.length+1, mode: GamificationModesMapping[mode], exercises: [], enabled: filteredLevels.length == 0})
      return {...gameModify};
    })
  }

  function addNewExercise(levelIndex: number) {
    setExerciseLevelModifying(GamificationModesMapping[mode]+"-"+levelIndex+"-"+(game.levels[levelIndex].exercises.length))
    setGame(prev => {
      let gameModify = {...prev};
      gameModify.levels[levelIndex].exercises.push({assignment: "", startSeq: [], endSeq: [], cardType: "numero"});
      return {...gameModify};
    })
  }

  function removeLevel(levelIndex: number) {
    setGame(prev => {
      let gameModify = {...prev};
      let lvls = [...gameModify.levels];
      const popped = lvls.splice(levelIndex, 1) as ExerciseLevel[];
      gameModify.levels = lvls;
      gameModify.levels.filter(lv => lv.mode === popped[0].mode && lv.n > popped[0].n).forEach((lvl) => {
        const lvlIndex = mapper[lvl.mode+"-"+lvl.n];
        gameModify.levels[lvlIndex-1].n = lvl.n-1;
      })
      return {...gameModify};
    })
    setExerciseLevelModifying("")
  }


  return (
    <>
      <select
        onChange={(event) => {
          const value = event.target.value as GamificationModes;
          setMode(value);
        }}
        value={mode}
        className="text-xl text-white p-2 my-4 w-1/4 rounded-lg"
        style={{ backgroundColor: "#73B9F9" }}
        onClick={(e) => e.stopPropagation()}
        onMouseOver={(e) => e.stopPropagation()}
      >
        <option className="max-w-md">Seleziona modalita</option>
        {modes.map((mode, index) => (
          <option key={index} value={mode}>
            {mode}
          </option>
        ))}
      </select>

      {filteredLevels.length === 0 ? (
        <NoElementMenu
          Svg={Puzzle}
          svg_dimension="small"
          title="No levels created"
          text=" By creating a level, you can let your students play with SmartGame"
          button_text="Add level"
          ButtonComponent={ButtonComponent}
        />) : (
          <>
            {filteredLevels.map((lv, levelIndex) => (
              <LevelBox
                isFirst={levelIndex === 0}
                isLast={levelIndex === filteredLevels.length-1}
                key={levelIndex}
                numLevel={lv.n}
              >
                <div className="font-semibold m-2"> Exercises contained in the level</div>
                {lv.exercises.length === 0 ? 
                  (<NoElementMenu
                    Svg={Puzzle}
                    svg_dimension="small"
                    title="No excercise created"
                    text=" Create an exercise by clicking the 'add exercise' button in the bottom left 
"
                  />) : 
                  lv.exercises.map((exec, index) =>
                    <ExerciseCard 
                      key={index}
                      exercise_modify={exercise_level_modifying}
                      setExerciseModifying={setExerciseLevelModifying}
                      game={game}
                      numExercise={index}
                      numLevel={mapper[lv.mode+"-"+lv.n]}
                      setGame={setGame} 
                    />
                )}
                <div className="flex gap-2">
                  <div>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        addNewExercise(mapper[lv.mode+"-"+lv.n])
                      }}
                      className="mb-4 uppercase bg-[#FF9900] text-xl text-white py-2 px-4 ease-in-out duration-75 hover:bg-amber-700 rounded-lg"
                    >
                      Add excercise
                    </button>
                  </div>
                  <div>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        removeLevel(mapper[lv.mode+"-"+lv.n])
                      }}
                      className="mb-4 uppercase bg-[#D73E3E] text-xl text-white py-2 px-4 ease-in-out duration-75 hover:bg-red-900 rounded-lg"
                    >
                      Remove level
                    </button>
                  </div>
                </div>
              </LevelBox>
            ))}
            <div>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  addNewLevel()
                }}
                className="mt-4 uppercase bg-[#146AB9] text-xl text-white py-2 px-4 ease-in-out duration-75 hover:bg-sky-500 rounded-lg"
              >
                Add level
              </button>
            </div>
          </>
        )}
    </>
  );
}

function DetailForm(props: {
  initial_detail?: Exercise;
  onSave: (new_detail: Exercise) => void;
  onCancel: () => void;
}) {
  const { initial_detail, onSave, onCancel } = props;
  const [assigment, setAssignment] = useState(initial_detail?.assignment)
  const [start, setStart] = useState(initial_detail?.startSeq.join(" "));
  const [solution, setSolution] = useState(initial_detail?.endSeq?.join(" "));
  const [cardType, setCardType] = useState<CardTypes>("numero");

  return (
    <div className="flex flex-col gap-5 my-4 p-2 w-full">
      <label className="flex gap-5 items-center">
        <p>Assignment</p>
        <input
          id="assignment"
          name="assignment"
          value={assigment}
          placeholder="Write the assignment..."
          className="w-full bg-slate-300 placeholder:text-slate-700 p-1 pl-3"
          onChange={(event) => setAssignment(event.currentTarget.value)}
        />
      </label>

      <label className="flex gap-5 items-center">
        <p className="whitespace-nowrap">Starting situation</p>
        <input
          id="start"
          name="start"
          value={start}
          placeholder="What appears on the screen? e.g. 1, 2, 3, 4, 5"
          className="w-full bg-slate-300 placeholder:text-slate-700 p-1 pl-3"
          onChange={(event) => setStart(event.currentTarget.value)}
        />
      </label>

      <label className="flex gap-5 items-center">
        <p>Solution</p>
        <input
          id="solution"
          name="solution"
          value={solution}
          placeholder="Cosa compare come soluzione? es: 1, 2, 3, 4, 5"
          className="w-full bg-slate-300 placeholder:text-slate-700 p-1 pl-3"
          onChange={(event) => setSolution(event.currentTarget.value)}
        />
      </label>

      <label className="flex gap-5 items-center">
        <p>Tipologia carte</p>
        <select
          onChange={(event) => {
            const value = event.target.value as CardTypes;
            setCardType(value);
          }}
          value={cardType}
          className="text-xl text-white p-2 my-4 w-1/4 rounded-lg"
          style={{ backgroundColor: "#73B9F9" }}
          onClick={(e) => e.stopPropagation()}
          onMouseOver={(e) => e.stopPropagation()}
        >
          <option className="max-w-md" value="numero">Numeri</option>
          <option className="max-w-md" value="mela">Mele</option>
        </select>
      </label>

      <div className="flex self-end w-2/3 justify-end">
        <button
          className="py-1 px-2 mr-2 text-md uppercase text-white hover:scale-105 ease-in-out duration-100 rounded-lg "
          style={{ backgroundColor: "#D73E3E" }}
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          className="py-1 px-2 text-md  uppercase text-white hover:scale-105 ease-in-out duration-100 rounded-lg"
          style={{ backgroundColor: "#FF9900" }}
          onClick={(e) => {
            e.preventDefault();
            onSave({assignment: assigment ?? "", startSeq: start?.split(" ") ?? [], endSeq: solution?.split(" "), cardType: cardType})
          }}
        >
          Save exercise
        </button>
      </div>
      
    </div>
  );
}