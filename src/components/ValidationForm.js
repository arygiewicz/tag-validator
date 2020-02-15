import React, { Component } from "react";
import "./ValidationForm.css";

class ValidationForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      textAreaValue: "",
      validationMessage: "",
      validationSuccess: false
    };
  }

  _handleTextAreaChange = event => {
    this.setState({
      textAreaValue: event.target.value,
      validationMessage: ""
    });
  };

  _handleSubmit = event => {
    event.preventDefault();

    const openingTags = this.state.textAreaValue.match(/<[A-Z]>/g) || [];
    const closingTags = this.state.textAreaValue.match(/<\/[A-Z]>/g) || [];

    const sameNumberOfOpeningAndClosingTags = this._checkIfSameLength(
      openingTags,
      closingTags
    );

    const tagArraysAreEmpty = this._checkIfEmpty(openingTags, closingTags);

    sameNumberOfOpeningAndClosingTags && !tagArraysAreEmpty
      ? this._checkIfSameTags(openingTags, closingTags)
      : this._checkWhichTagIsMissing(openingTags, closingTags);
  };

  _checkIfSameLength = (array1, array2) => array1.length === array2.length;

  _checkIfEmpty = (array1, array2) => {
    if (array1.length === 0 && array2.length === 0) {
      this.setState({
        validationMessage: "Please enter a text with tags.",
        validationSuccess: false
      });
    }
    return array1.length === 0 && array2.length === 0;
  };

  _checkIfSameTags = (array1, array2) => {
    const modifiedArray1 = [...array1].map(item => item.replace(/[<>\/]/g, ""));
    const reversedAndModifiedArray2 = [...array2]
      .reverse()
      .map(item => item.replace(/[<>\/]/g, ""));

    const nonMatchingTags = [];

    for (let i = 0; i < modifiedArray1.length; i++) {
      if (modifiedArray1[i] !== reversedAndModifiedArray2[i]) {
        nonMatchingTags.push([modifiedArray1[i], reversedAndModifiedArray2[i]]);
      }
    }

    this.setState({
      validationMessage:
        nonMatchingTags.length > 0
          ? `Expected </${
              nonMatchingTags[nonMatchingTags.length - 1][0]
            }> found </${nonMatchingTags[nonMatchingTags.length - 1][1]}>`
          : "Correctly tagged paragraph",
      validationSuccess: !nonMatchingTags.length
    });
  };

  _checkWhichTagIsMissing = (array1, array2) => {
    const modifiedArray1 = [...array1].map(item => item.replace(/[<>\/]/g, ""));
    const modifiedArray2 = [...array2].map(item => item.replace(/[<>\/]/g, ""));
    let missingTags;

    if (modifiedArray1.length > modifiedArray2.length) {
      missingTags = modifiedArray1.filter(
        element => !modifiedArray2.includes(element)
      );
      this.setState({
        validationMessage: `Expected </${missingTags[0]}> found #`
      });
    } else if (modifiedArray2.length > modifiedArray1.length) {
      missingTags = modifiedArray2.filter(
        element => !modifiedArray1.includes(element)
      );
      this.setState({
        validationMessage: `Expected # found </${
          missingTags[missingTags.length - 1]
        }>`,
        validationSuccess: false
      });
    }
  };

  render() {
    return (
      <div className='ValidationForm'>
        <form className='ValidationForm-inner' onSubmit={this._handleSubmit}>
          <div>
            <p> Copy - paste html to validate tags: </p>
          </div>
          <textarea
            className='ValidationForm-textarea'
            value={this.state.textAreaValue}
            onChange={this._handleTextAreaChange}
          />
          <div>
            <button
              type='submit'
              className={`ValidationForm-button ${
                this.state.textAreaValue
                  ? "ValidationForm-button--enabled"
                  : null
              }`}
              disabled={!this.state.textAreaValue}>
              VALIDATE
            </button>
          </div>
        </form>
        <div>
          <p className={this.state.validationSuccess ? "success" : "error"}>
            {this.state.validationMessage}
          </p>
        </div>
      </div>
    );
  }
}

export default ValidationForm;
