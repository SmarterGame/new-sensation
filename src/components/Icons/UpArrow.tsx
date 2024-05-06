import React from "react";

export function UpArrow({height = 20, width = 20}: {height?: number, width?: number}) {
    return (
        <svg fill="#000000" height={height+"px"} width={width+"px"} version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 512.01 512.01">
        <g>
            <g>
                <path d="M505.755,358.256L271.088,123.589c-8.341-8.341-21.824-8.341-30.165,0L6.256,358.256c-8.341,8.341-8.341,21.824,0,30.165
                    s21.824,8.341,30.165,0l219.584-219.584l219.584,219.584c4.16,4.16,9.621,6.251,15.083,6.251c5.462,0,10.923-2.091,15.083-6.251
                    C514.096,380.08,514.096,366.597,505.755,358.256z"/>
            </g>
        </g>
        </svg>
    )
}