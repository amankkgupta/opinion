import React, { useRef, useState } from "react";
import { format } from "date-fns";
import { Heart } from "lucide-react";
import { useDispatch } from "react-redux";
import { BiSolidUpvote } from "react-icons/bi";
import { useNavigate } from "react-router-dom";



const DebateCard = ({ debate, liked, Qno, isMine, currPage, ind }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const likeBtn = useRef(null);

  const onCardClick = (e) => {
    if(isMine) return;
    dispatch(fetchVotes(debate._id));
    dispatch(setDebate(debate));
    dispatch(setLike({act:false, liked}));
    dispatch(setQno(Qno));
  };

  const handleLike = (_id, index) => {
    dispatch(likeRequest(_id));
    liked
      ? dispatch(setLiked({ index, val: -1 }))
      : dispatch(setLiked({ index, val: 1 }));
  };

  return (
    <div
      key={ind}
      onClick={(e) => onCardClick(e)}
      className={`${
        isMine ? "bg-blue-600" : "bg-indigo-600"
      } rounded-lg p-5 w-full text-white `}
    >
      <div className="flex justify-between items-center">
        <h1 className="font-semibold">
          Asked by <span className="text-red-400">{debate.createdBy}</span> on{" "}
          <span className="text-green-400">
            {format(new Date(debate.createdOn), "dd-MM-yyyy,  hh:mm a")}
          </span>
        </h1>
        <button
          ref={likeBtn}
          disabled={isMine}
          onClick={(e) => {
            e.stopPropagation();
            handleLike(debate._id, Qno - 1);
          }}
          className={`flex gap-3 justify-center ${
            liked ? "text-red-500" : ""
          } font-bold items-center`}
        >
          <Heart fill={liked ? "red" : "white"} />
          {debate.totalLikes}
        </button>
      </div>

      <div>
        <h1 className="font-extrabold text-xl py-2">
          {Qno}. {debate.question}
        </h1>
      </div>

      <div className="flex gap-5 flex-col md:flex-row justify-start md:items-center">
        <div className="options w-full">
          {debate.options.map((option, ind) => {
            return (
              <div
                key={ind}
                className="option w-full flex-wrap font-bold flex justify-between py-1 items-center"
              >
                <div className={`${option.isRemoved?"bg-red-500":""} w-full bg-blue-400 rounded-lg px-2 flex gap-3 flex-wrap justify-between items-center`}>
                  <h1 key={ind}>{`${ind + 1}. ${option.answer}`}</h1>
                  <button
                    className={`flex gap-2 justify-center font-bold items-center`}
                  >
                    <BiSolidUpvote size={28} fill="white" />
                    {option.votes}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="graph w-full h-full flex justify-center items-center">
          <h1>for Charts</h1>
        </div>
      </div>
    </div>
  );
};

export default DebateCard;
