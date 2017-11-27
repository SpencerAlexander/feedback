import { fetch, addTask } from "domain-task";
import { Action, Reducer, ActionCreator } from "redux";
import { AppThunkAction } from "./";

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface FeedbackState {
  isLoading: boolean;
  startDateIndex?: number;
  feedback: Feedback[];
}

export interface Feedback {
  createdDateFormatted: string;
  name: string;
  comments: string;
  status: string;
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.

interface RequestFeedbackAction {
  type: "REQUEST_FEEDBACK";
  startDateIndex: number;
}

interface ReceiveFeedbackAction {
  type: "RECEIVE_FEEDBACK";
  startDateIndex: number;
  feedback: Feedback[];
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = ReceiveFeedbackAction | RequestFeedbackAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
  requestFeedback: (startDateIndex: number): AppThunkAction<KnownAction> => (
    dispatch,
    getState
  ) => {
    // Only load data if it's something we don't already have (and are not already loading)
    if (startDateIndex !== getState().feedback.startDateIndex) {
      let fetchTask = fetch(
        `api/SampleData/Feedback?startDateIndex=${startDateIndex}`
      )
        .then(response => response.json() as Promise<Feedback[]>)
        .then(data => {
          dispatch({
            type: "RECEIVE_FEEDBACK",
            startDateIndex: startDateIndex,
            feedback: data
          });
        });

      addTask(fetchTask); // Ensure server-side prerendering waits for this to complete
      dispatch({
        type: "REQUEST_FEEDBACK",
        startDateIndex: startDateIndex
      });
    }
  }
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const unloadedState: FeedbackState = {
  feedback: [],
  isLoading: false
};

export const reducer: Reducer<FeedbackState> = (
  state: FeedbackState,
  incomingAction: Action
) => {
  const action = incomingAction as KnownAction;
  switch (action.type) {
    case "REQUEST_FEEDBACK":
      return {
        startDateIndex: action.startDateIndex,
        feedback: state.feedback,
        isLoading: true
      };
    case "RECEIVE_FEEDBACK":
      // Only accept the incoming data if it matches the most recent request. This ensures we correctly
      // handle out-of-order responses.
      if (action.startDateIndex === state.startDateIndex) {
        return {
          startDateIndex: action.startDateIndex,
          feedback: action.feedback,
          isLoading: false
        };
      }
      break;
    default:
      // The following line guarantees that every action in the KnownAction union has been covered by a case above
      const exhaustiveCheck: never = action;
  }

  return state || unloadedState;
};
