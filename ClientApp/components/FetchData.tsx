import * as React from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { connect } from "react-redux";
import { ApplicationState } from "../store";
import * as FeedbackState from "../store/Feedback";

// At runtime, Redux will merge together...
type FeedbackProps = FeedbackState.FeedbackState & // ... state we've requested from the Redux store
  typeof FeedbackState.actionCreators & // ... plus action creators we've requested
  RouteComponentProps<{ startDateIndex: string }>; // ... plus incoming routing parameters

class FetchData extends React.Component<FeedbackProps, {}> {
  componentWillMount() {
    // This method runs when the component is first added to the page
    let startDateIndex = parseInt(this.props.match.params.startDateIndex) || 0;
    this.props.requestFeedback(startDateIndex);
  }

  componentWillReceiveProps(nextProps: FeedbackProps) {
    // This method runs when incoming props (e.g., route params) change
    let startDateIndex = parseInt(nextProps.match.params.startDateIndex) || 0;
    this.props.requestFeedback(startDateIndex);
  }

  public render() {
    return (
      <div>
        <h1>Feedback</h1>
        <p>
          This component demonstrates fetching data from the server and working
          with URL parameters.
        </p>
        {this.renderFeedbackTable()}
        {this.renderPagination()}
      </div>
    );
  }

  private renderFeedbackTable() {
    return (
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Comments</th>
            <th>Status</th>
            <th>CreatedDateFormatted</th>
          </tr>
        </thead>
        <tbody>
          {this.props.feedback.map(feedback => (
            <tr key={feedback.createdDateFormatted}>
              <td>{feedback.name}</td>
              <td>{feedback.comments}</td>
              <td>{feedback.status}</td>
              <td>{feedback.createdDateFormatted}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  private renderPagination() {
    let prevStartDateIndex = (this.props.startDateIndex || 0) - 5;
    let nextStartDateIndex = (this.props.startDateIndex || 0) + 5;

    return (
      <p className="clearfix text-center">
        <Link
          className="btn btn-default pull-left"
          to={`/fetchdata/${prevStartDateIndex}`}
        >
          Previous
        </Link>
        <Link
          className="btn btn-default pull-right"
          to={`/fetchdata/${nextStartDateIndex}`}
        >
          Next
        </Link>
        {this.props.isLoading ? <span>Loading...</span> : []}
      </p>
    );
  }
}

export default connect(
  (state: ApplicationState) => state.feedback, // Selects which state properties are merged into the component's props
  FeedbackState.actionCreators // Selects which action creators are merged into the component's props
)(FetchData) as typeof FetchData;
