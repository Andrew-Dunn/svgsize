/*
 * Copyright 2016 Andrew Dunn.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* description: Parses and evaluates the value of an SVG length. */

/* lexical grammar */
%lex

%%
[+-]                           return 'SIGN';
[0-9]                          return 'DIGIT';
\.                             return 'PERIOD';
(em|ex|px|in|cm|mm|pt|pc|\%)   return 'UNIT';
[Ee]                           return 'EXP';

/lex

%start length

%% /* language grammar */

length
    : number UNIT
        {return {value: $1, units: $2};}
    | number
        {return {value: $1, units: ''};}
    ;

number
    : sign posnumber
        {$$ = $1 * $2;}
    | posnumber
    ;

posnumber
    : plainnumber exponent
        {$$ = $1 * Math.pow(10, $2);}
    | plainnumber
    ;

plainnumber
    : digits
    | float
    ;

float
    : digits fractional
        {$$ = $1 + $2;}
    | fractional
    ;

fractional
    : PERIOD digits
        {$$ = +('0.' + $2);}
    ;

exponent
    : EXP sign digits
        {$$ = $2 * $3;}
    | EXP digits
        {$$ = $2;}
    ;

sign
    : SIGN
        {$$ = ($1 == '+' ? 1 : -1);}
    ;

digits
    : digits DIGIT
        {$$ = $1*10 + (+$2);}
    | DIGIT
        {$$ = +$1;}
    ;
