import React from "react";

import { render, cleanup, waitForElement, getByText, queryByText, prettyDOM, getByTestId, getAllByTestId, getByAltText, fireEvent, getByPlaceholderText, queryByAltText } from "@testing-library/react";

import Application from "components/Application";

import axios from "axios";


afterEach(cleanup);

describe("Application", () => {
  it("defaults to Monday and changes the schedule when a new day is selected", async() => {
    const { getByText } = render(<Application />);

    await waitForElement(() => getByText("Monday"))
    fireEvent.click(getByText("Tuesday"));
    expect(getByText("Leopold Silvers")).toBeInTheDocument();
  });

  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async() => {

    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];

    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, /Enter Student Name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, "Saving...")).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));
    
    const days = getAllByTestId(container, "day");
    const monday = days.find( day => queryByText(day, "Monday"));
  
    
    expect(getByText(monday, "no spots remaining")).toBeInTheDocument();

  })

  it ("loads data, cancels an interview and increases the spots remaining for Monday by 1", async() => {
    //1 render application
    const { container } = render(<Application />);
    
    // 2 wait untiltext "Archie Cohen" is displayed
    await waitForElement(() => getByText(container, "Archie Cohen"));
    //3 click the delete button
    const appointment = getAllByTestId(container, "appointment").find( appointment => queryByText(appointment, "Archie Cohen"));
    fireEvent.click(queryByAltText(appointment, "Delete"));

    // 4 check that the confirmation message is shown
    expect(getByText(appointment, "Are you sure you would like to delete?")).toBeInTheDocument();

    //5 click the confirm button
    fireEvent.click(queryByText(appointment, "Confirm"));

    //6 check that the element with the text "Deleting..."" is displayed

    expect(getByText(appointment,"Deleting...")).toBeInTheDocument();

    //7 wait until the element with the add alt text is displayed

    await waitForElement(() => getByAltText(appointment, "Add"));

    //7 check that the daylistitem with the text Monday also has the text "2 spots remaining"

    const monday = getAllByTestId(container, "day").find( day => queryByText(day, "Monday"));
    expect(getByText(monday, "2 spots remaining")).toBeInTheDocument();
    
  })

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    //1 render application
    const { container } = render(<Application />);
    //2 wait until text "Archie Cohen" is displayed
    await waitForElement(() => getByText(container, "Archie Cohen"));
    //3 click the edit button
    const appointment = getAllByTestId(container, "appointment").find( appointment => queryByText(appointment, "Archie Cohen"));
    fireEvent.click(queryByAltText(appointment, "Edit"));

    //4 change the student name to Jessie Wrong

    fireEvent.change(getByTestId(appointment, "student-name-input"), {
      target: { value: "Jessie Wrong" }
    });

    //5a click the savebutton
    fireEvent.click(getByText(appointment, "Save"));

    //5 check that the element with the text "Saving..." is displayed
    expect(getByText(appointment, "Saving...")).toBeInTheDocument();

    //6 wait until the element with the alt text "edit" is displayed
    await waitForElement(() => getByAltText(appointment, "Edit"));

    //7 check that the element with the text "Jessie Wrong" is displayed

    expect(getByText(appointment, "Jessie Wrong")).toBeInTheDocument();
    //8 check that the dayListItem with the text Monday also has the text "1 spot remaining"
    const monday = getAllByTestId(container, "day").find( day => queryByText(day, "Monday"));
    expect(getByText(monday, "1 spot remaining")).toBeInTheDocument();
  })

  it("shows the save error when failing to save an appointment and does not change the spots remaining", async () => {
    axios.put.mockRejectedValueOnce();
    // 1 render application

    const { container, debug } = render(<Application />);
    //2 wait until text "Archie Cohen" is displayed
    await waitForElement(() => getByText(container, "Archie Cohen"));

    //3 click the add button
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];
    fireEvent.click(getByAltText(appointment, "Add"));

    //4 fill in the student name and interviewer

    fireEvent.change(getByPlaceholderText(appointment, /Enter Student Name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));
    //5 check that saving shows
    expect(getByText(appointment, "Saving...")).toBeInTheDocument();

    //6 wait for error message to load
    await waitForElement(()=> getByText(appointment, "Error"));
    
    //7 confirm that the element with the text "Could not save due to an error" is displayed
    expect(getByText(appointment, "Could not save due to an error")).toBeInTheDocument();

    //8 check that the dayListItem with the text Monday has the text "1 spot remaining" i.e. that spots remaining didn't change
    const monday = getAllByTestId(container, "day").find( day => queryByText(day, "Monday"));
    expect(getByText(monday, "1 spot remaining")).toBeInTheDocument();
  })

  it("shows the delete error when failing to delte an appointment and does not change the spots remaining", async () => {
    axios.delete.mockRejectedValueOnce();
     //1 render application
     const { container } = render(<Application />);
     //2 wait until text "Archie Cohen" is displayed
     await waitForElement(() => getByText(container, "Archie Cohen"));
     //3 click the delete button
     const appointment = getAllByTestId(container, "appointment").find( appointment => queryByText(appointment, "Archie Cohen"));
     fireEvent.click(queryByAltText(appointment, "Delete"));
     // 4 check that the confirmation message is shown
    expect(getByText(appointment, "Are you sure you would like to delete?")).toBeInTheDocument();

    //5 click the confirm button
    fireEvent.click(queryByText(appointment, "Confirm"));

    //6 check that the element with the text "Deleting..."" is displayed

    expect(getByText(appointment,"Deleting...")).toBeInTheDocument();

    //7 wait for error message to load
    await waitForElement(()=> getByText(appointment, "Error"));

    //8 confirm that the element with the text "Could not delete due to an error" is displayed
    expect(getByText(appointment, "Could not delete due to an error")).toBeInTheDocument();

    //9 confirm that spots remaining didn'tchange
    const monday = getAllByTestId(container, "day").find( day => queryByText(day, "Monday"));
    expect(getByText(monday, "1 spot remaining")).toBeInTheDocument();

  })


})