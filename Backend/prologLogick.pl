% --- Game Board Definitions ---
line([a,b,c]).
line([d,e,f]).
line([g,h,i]).
line([a,d,g]).
line([b,e,h]).
line([c,f,i]).
line([a,e,i]).
line([g,e,c]).

% --- Adjacency (movement logic) ---
connected(a, b). connected(a, d). connected(a, e).
connected(b, a). connected(b, c). connected(b, e).
connected(c, b). connected(c, f). connected(c, e).
connected(d, a). connected(d, e). connected(d, g).
connected(e, a). connected(e, b). connected(e, c).
connected(e, d). connected(e, f). connected(e, g).
connected(e, h). connected(e, i).
connected(f, c). connected(f, e). connected(f, i).
connected(g, d). connected(g, e). connected(g, h).
connected(h, g). connected(h, e). connected(h, i).
connected(i, f). connected(i, e). connected(i, h).

adjacent(X, Y) :- connected(X, Y).

% --- Movement check based on Board ---
isMovable(From, To, Board) :-
    adjacent(From, To),
    \+ member(To, Board).

% --- Check if a 3-pos list forms a line ---
forms_line(PosList) :-
    line(Line),
    subset(Line, PosList).

% --- Validate 3-pos placement (must not be a line) ---
valid_placement(PosList) :-
    length(PosList, 3),
    \+ forms_line(PosList).

% --- All possible board positions ---
positions([a,b,c,d,e,f,g,h,i]).

% --- Get all 3-length combinations from a list ---
combination(0, _, []) :- !.
combination(N, [X|Xs], [X|Ys]) :-
    N1 is N - 1,
    combination(N1, Xs, Ys).
combination(N, [_|Xs], Ys) :-
    combination(N, Xs, Ys).

% --- Find all valid red placements (no line) ---
red_valid_placement(UserPositions, RedPositionsList) :-
    positions(AllPositions),
    subtract(AllPositions, UserPositions, Available),
    findall(RedPos,
        (
            combination(3, Available, RedPos),
            valid_placement(RedPos)
        ),
        RedPositionsList).

% --- Get [Removed, Missing] pairs that can complete a line ---
get_line_filling_positions(PosList, Result) :-
    findall([Removed, Missing],
        (
            select(Removed, PosList, [P1, P2]),
            line(Line),
            member(P1, Line),
            member(P2, Line),
            subtract(Line, [P1, P2], [Missing])
        ),
        Result).

% --- Filter only those filling moves that are physically possible ---
include_valid_moves(_, [], []).  % Base case

include_valid_moves(Board, [[Removed, Missing] | T], Result) :-
    include_valid_moves(Board, T, R1),
    ( isMovable(Removed, Missing, Board) ->
        Result = [[Removed, Missing] | R1]
    ;
        Result = R1
    ).

% --- Get list of dangerous positions based on user positions and board state ---
get_dangerous_positions(UserPositions, Board, ValidMissingList) :-
    get_line_filling_positions(UserPositions, FillPairs),
    include_valid_moves(Board, FillPairs, FilteredPairs),
    findall(Missing, member([_, Missing], FilteredPairs), Raw),
    sort(Raw, ValidMissingList).  % Remove duplicates

filter_matching_lists(_, [], []).
filter_matching_lists(ListOne, [Sublist | Tail], [Sublist | FilteredTail]) :-
    subset(ListOne, Sublist),
    filter_matching_lists(ListOne, Tail, FilteredTail).
filter_matching_lists(ListOne, [_ | Tail], FilteredTail) :-
    filter_matching_lists(ListOne, Tail, FilteredTail).

% --- Start the game ---
start_game(UserPositions,Board, BestValidPositions) :-
    valid_placement(UserPositions),
    red_valid_placement(UserPositions, RedValidPositions),
    get_dangerous_positions(UserPositions, Board, DangerousPositions),  % Board is same as UserPositions
    filter_matching_lists(DangerousPositions,RedValidPositions,BestValidPositions),
    !.

isWon(PosList) :-
    forms_line(PosList),
    write("you are won").
    

get_my_winning_movement(MyPositions, Board, NewPositions) :-
    get_dangerous_positions(MyPositions, Board, DpList),
    get_line_filling_positions(MyPositions, LFP2DList),
    member(Missing, DpList),
    member([Removed, Missing], LFP2DList),
    select(Removed, MyPositions, Temp),
    \+ member(Missing, Temp),
    NewPositions = [Missing | Temp],
    !.


get_user_wining_avoiding_movement(UserPositions,MyPositions, Board, NewPositions) :-
    get_dangerous_positions(UserPositions, Board, DpList),
    (
        try_move(MyPositions, DpList, Board, [Removed, Missing])
    ->
        true
    ;
        % No valid move found, pick any available empty position
        positions(AllPositions),
        subtract(AllPositions, Board, EmptyPositions),
        EmptyPositions = [Missing | _],
        MyPositions = [Removed | _]  % arbitrarily remove the first user piece
    ),
    % Update MyPositions by removing 'Removed' and adding 'Missing'
    select(Removed, MyPositions, Temp),
    NewPositions = [Missing | Temp],
    !.


% Try moving each UserPosition to each DangerousPosition
try_move([Removed | _], [Missing | _], Board, [Removed, Missing]) :-
    isMovable(Removed, Missing, Board),
    !.

try_move([Removed | RestUser], [Missing | RestDanger], Board, Result) :-
    (
        isMovable(Removed, Missing, Board)
    ->
        Result = [Removed, Missing]
    ;
        try_move(RestUser, [Missing | RestDanger], Board, Result)
    ).

try_move(UserList, [_ | RestDanger], Board, Result) :-
    try_move(UserList, RestDanger, Board, Result).


get_next_movement(UserPositions, MyPositions, NewPositions) :-
    append(UserPositions, MyPositions, Board),
    (
        isWon(UserPositions)
    ->
        _ = UserPositions  
    ;
        get_my_winning_movement(MyPositions, Board, NewPositions)
    ->
        true
    ;
        get_user_wining_avoiding_movement(UserPositions,MyPositions, Board, NewPositions)
    ).
