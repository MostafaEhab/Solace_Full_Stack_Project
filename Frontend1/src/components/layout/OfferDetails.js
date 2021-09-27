import Card from "@material-ui/core/Card";
import classes from "../../css/OfferDetails.module.css";
import Button from "@material-ui/core/Button";
import Chip from "@material-ui/core/Chip";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import axios from "axios";
import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";

class OfferDetailsView extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isLoading: true };
    this.userId = localStorage.userId;
    this.offerId = props.match.params.id;
  }

  async componentDidMount() {
    const res = await axios.get("/api/offers/" + this.offerId);
    this.offer = res.data;

    const requester = (await axios.get("/api/users/" + this.offer.requesterId))
      .data;
    const user = (await axios.get("/api/users/" + this.userId)).data;
    this.mapIdToUser = {};
    this.mapIdToUser[this.offer.requesterId] = requester;
    this.mapIdToUser[this.userId] = user;
    for (let id of this.offer.appliedUserIds) {
      this.mapIdToUser[id] = (await axios.get("/api/users/" + id)).data;
    }

    const reviews = (
      await axios.get("/api/reviews/review-on-offer/" + this.offerId)
    ).data;
    this.setState({ isLoading: false, offer: this.offer, reviews: reviews });
  }

  formatDate(date) {
    date = new Date(date);
    let month = date.getMonth() + 1;
    let day = date.getDate();
    const year = date.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [day, month, year].join("/");
  }

  render() {
    if (this.state.isLoading) {
      return (
        <div className={classes.loading}>
          <CircularProgress />
        </div>
      );
    } else {
      return (
        <div>
          <Card className={classes.root} variant="outlined">
            <Avatar
              onClick={() => this.goToUser(this.state.offer.requesterId)}
              className={classes.avatar}
              style={{cursor: "pointer",}}
            >
              {this.getUserInitials()}
            </Avatar>
            <h1 className={classes.title}>{this.state.offer.title}</h1>
            <Chip
              className={classes.state}
              label={this.state.offer.state}
              variant="outlined"
            />
            <p className={classes.description}>
              {this.state.offer.description}
            </p>
            <div className={classes.details}>
              <p>
                <b>Price:</b>{" "}
                <span>
                  {this.state.offer.currency === "USD"
                    ? "$" + this.state.offer.price
                    : "€" + this.state.offer.price}
                </span>
                <br />
                <b>City:</b> <span>{this.state.offer.city}</span>
                <br />
                <b>Start date:</b>{" "}
                <span>{this.formatDate(this.state.offer.startDate)}</span>
                <br />
                <b>End date:</b>{" "}
                <span>{this.formatDate(this.state.offer.endDate)}</span>
                <br />
                <b>Executer:</b>{" "}
                {!this.state.offer.executerId && <span>None assigned yet</span>}
                {this.state.offer.executerId && (
                  <span>
                    <Button color="default" onClick={this.goToExecuter}>
                      {this.mapIdToUser[this.state.offer.executerId].firstName +
                        " " +
                        this.mapIdToUser[this.state.offer.executerId].lastName +
                        (this.state.offer.executerId === this.userId
                          ? " (ME)"
                          : "")}
                    </Button>
                  </span>
                )}
              </p>
            </div>

            <div>
              {this.state.offer.tags.map((tag) => (
                <Chip
                  variant="outlined"
                  className={classes.tag}
                  key={tag}
                  label={tag}
                />
              ))}
            </div>

            {this.showAppliedUsers() && (
              <div className={classes.appliedUsersSection}>
                <h2>Applied users:</h2>
                {this.state.offer.appliedUserIds.length === 0 && (
                  <p className={classes.emptyApplicationList}>
                    No applications yet for this offer.
                  </p>
                )}
                <List component="div" disablePadding>
                  {this.state.offer.appliedUserIds.map((id) => {
                    return (
                      <ListItem
                        onClick={() => {
                          this.goToUser(id);
                        }}
                        key={id}
                        button
                      >
                        {this.mapIdToUser[id].firstName +
                          " " +
                          this.mapIdToUser[id].lastName}

                        <ListItemSecondaryAction>
                          <Button
                            onClick={() => {
                              this.chooseUser(id);
                            }}
                            className={classes.cancel}
                            color="default"
                          >
                            Choose
                          </Button>
                        </ListItemSecondaryAction>
                      </ListItem>
                    );
                  })}
                </List>
              </div>
            )}

            {this.shouldShowAppliedUserNotification() && (
              <div className={classes.appliedUserNotification}>
                You have already applied. Waiting on requester to choose an
                executer.
              </div>
            )}

            {this.shouldShowAlreadyReviewedNotification() && (
              <div className={classes.reviewedNotification}>
                Thanks for your review!
              </div>
            )}

            <div className={classes.action}>
              <ButtonGroup
                color="primary"
                aria-label="outlined primary button group"
              >
                {this.shouldShowPayButton() && (
                  <Button onClick={this.pay} color="default">
                    Pay
                  </Button>
                )}
                {false && (
                  <Button className={classes.cancel} color="default">
                    Cancel application
                  </Button>
                )}
                {this.shouldShowApplyButton() && (
                  <Button color="default" onClick={this.applyToOffer}>
                    Apply
                  </Button>
                )}
                {this.shouldShowMarkedAsCompleted() && (
                  <Button
                    disabled={this.state.markCompleteDisabled}
                    onClick={this.markCompleted}
                    color="default"
                  >
                    Mark completed
                  </Button>
                )}
                {this.shouldShowReviewButton() && (
                  <Button onClick={this.navigateToOfferPage} color="default">
                    Add review
                  </Button>
                )}
              </ButtonGroup>
            </div>
          </Card>
        </div>
      );
    }
  }

  navigateToOfferPage = () => {
    this.props.history.push("/reviews/offer/" + this.offerId);
  };

  shouldShowReviewButton = () => {
    return (
      this.state.offer.state === "COMPLETED" &&
      (this.userId === this.state.offer.executerId ||
        this.userId === this.state.offer.requesterId) &&
      this.state.reviews.length === 0
    );
  };

  markCompleted = async () => {
    this.setState((prevState) => {
      const newState = { ...prevState };
      newState.markCompleteDisabled = true;
      return newState;
    });

    await axios.put("/api/offers/complete/" + this.offerId);

    this.setState((prevState) => {
      const newState = { ...prevState };
      newState.offer.state = "COMPLETED";
      return newState;
    });
  };

  pay = async () => {
    const paypalUrl = (await axios.put("/api/offers/pay/" + this.offerId)).data
      .redirect;
    window.location.href = paypalUrl;
  };

  shouldShowMarkedAsCompleted() {
    return (
      this.state.offer.state === "PAID" &&
      this.userId === this.state.offer.requesterId
    );
  }

  getUserInitials() {
    const initials =
      this.mapIdToUser[this.state.offer.requesterId].firstName[0] +
      this.mapIdToUser[this.state.offer.requesterId].lastName[0];
    return initials.toUpperCase();
  }

  shouldShowAlreadyReviewedNotification() {
    return (
      this.state.offer.state === "COMPLETED" && this.state.reviews.length > 0
    );
  }

  shouldShowAppliedUserNotification() {
    return (
      this.state.offer.appliedUserIds.filter((id) => this.userId === id)
        .length > 0 &&
      this.state.offer.state !== "COMPLETED" &&
      this.state.offer.state !== "MATCHED"
    );
  }

  showAppliedUsers() {
    return (
      this.state.offer.state === "NEW" &&
      this.state.offer.requesterId === this.userId
    );
  }

  async chooseUser(userId) {
    await axios.put("/api/offers/choose/" + this.offerId, {
      executerId: userId,
    });

    this.setState((prevState) => {
      const newState = { ...prevState };
      newState.offer.executerId = userId;
      newState.offer.state = "MATCHED";
      return newState;
    });
  }

  goToUser(userId) {
    this.props.history.push("/users/" + userId);
  }

  goToExecuter = async (executerId) => {
    this.props.history.push("/users/" + this.state.offer.executerId);
  };

  applyToOffer = async () => {
    await axios.put("/api/offers/apply/" + this.offerId);
    this.setState((prevState) => {
      const newState = { ...prevState };
      newState.offer.appliedUserIds.push(this.userId);
      return newState;
    });
  };

  shouldShowPayButton() {
    return (
      this.state.offer.requesterId === this.userId &&
      this.state.offer.state === "MATCHED"
    );
  }

  shouldShowApplyButton() {
    return (
      this.state.offer.requesterId !== this.userId &&
      this.state.offer.state === "NEW" &&
      this.state.offer.appliedUserIds.filter((id) => id === this.userId)
        .length === 0
    );
  }
}

export default OfferDetailsView;
