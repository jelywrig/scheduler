import React from "react";

import { render, cleanup, waitForElement, getByText, queryByText, prettyDOM, getAllByTestId, getByAltText, fireEvent, getByPlaceholderText, queryByAltText } from "@testing-library/react";

import Application from "components/Application";


afterEach(cleanup);

describe("Application", () => {
  it("defaults to Monday and changes the schedule when a new day is selected", async() => {
    const { getByText } = render(<Application />);

    await waitForElement(() => getByText("Monday"))
    fireEvent.click(getByText("Tuesday"));
    expect(getByText("Leopold Silvers")).toBeInTheDocument();
  });

  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async() => {

    const { container, debug } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];
    

    // await waitForElement(() => getByText("Archie Cohen"));

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

    //7 wait until the element with the text add alt text is displayed

    await waitForElement(() => getByAltText(appointment, "Add"));

    //7 check that the daylistitem with the text Monday also has the text "2 spots remaining"

    const monday = getAllByTestId(container, "day").find( day => queryByText(day, "Monday"));
    expect(getByText(monday, "2 spots remaining")).toBeInTheDocument();
    
  })

})