// import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import printJS from "print-js";

const FillForm = () => {
  // const navigate = useNavigate();
  const [dataBus, setDataBus] = useState({});
  const [isPayment, setIsPayment] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const email = userInfo.user.email;
  const token = userInfo.token.token;
  const busId = getUrlParameter("bus-operator");

  const getInfoBus = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/bus/${busId}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!data) {
        alert("[ERROR]: Cannot get response from server");
      } else if (data.error) {
        alert("[ERROR]: " + data.error);
      } else {
        setDataBus(data);
      }
    } catch (error) {
      console.log("[ERROR]", error);
    }
  };

  useEffect(() => {
    getInfoBus();
    // console.log("DATA BUS", dataBus);
  }, [dataBus]);

  const handleCancel = () => {
    window.location.href = window.localStorage.getItem("url");
  };

  const handleHome = () => (window.location.href = "/");

  const handlePrintPDF = () => {
    const node = document.getElementById("table").innerHTML;
    console.log("NODEEE", node);
    printJS("table", "html");
  };

  function getUrlParameter(name) {
    let results = new RegExp("[?&]" + name + "=([^&#]*)").exec(
      window.location.href
    );
    if (results == null) {
      return null;
    }
    return decodeURI(results[1]) || 0;
  }

  const handleSubmitForm = async () => {
    console.log("BUSOP", busId);
    console.log("EMAIL", email);
    const name = document.getElementById("inputFullName").value;
    const phone = document.getElementById("inputPhone").value;
    const numOfSeats = Number(
      document.getElementById("inputNumberOfSeat").value
    );
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/ticket/create/${busId}`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token.token}`,
          },
          body: JSON.stringify({
            name,
            phone,
            numOfSeats,
          }),
        }
      );
      const data = await response.json();
      if (!data) {
        alert("[ERROR]: Cannot get response from server");
      } else if (data.error) {
        alert(
          "The number of seats you booked exceed the maximum number of seats\nPlease try again!!!"
        );
      } else {
        console.log(JSON.stringify(data));
        document.querySelector("#title p").textContent = "Booking details";
        const msToTime = (ms) => {
          let seconds = (ms / 1000).toFixed(1);
          let minutes = (ms / (1000 * 60)).toFixed(1);
          let hours = (ms / (1000 * 60 * 60)).toFixed(1);
          let days = (ms / (1000 * 60 * 60 * 24)).toFixed(1);
          if (seconds < 60) return seconds + " Seconds";
          else if (minutes < 60) return minutes + " Minutes";
          else if (hours < 24) return hours + " Hours";
          else return days + " Days";
        };
        const ticketIds = data.ticket_ids.map((tid) => `<li>${tid}</li>`);
        console.log("TICKETIDS", data);
        const template = `<div class='showTable'>
            <div id="table">
                <table class='table table-hover table-striped'>
                <tbody>
                    <tr style='height: 80px'>
                    <th class='quarter-width align-middle ps-4'>Full name</th>
                    <td class='quarter-width align-middle'>${data.name}</td>
                    <th class='quarter-width align-middle ps-4'>Email</th>
                    <td class='quarter-width align-middle'>${email}</td>
                    </tr>
                    <tr style='height: 80px'>
                    <th class='quarter-width align-middle ps-4'>Ticket id</th>
                    <td class='quarter-width align-middle'>
                        <ul class='disc-list-style-type px-3'>
                        ${ticketIds.join("")}
                        </ul>
                    </td>
                    <th class='quarter-width align-middle ps-4'>Bus operator</th>
                    <td class='quarter-width align-middle'>${data.bo_name}</td>
                    </tr>
                    <tr style='height: 80px'>
                    <th class='quarter-width align-middle ps-4'>Start point</th>
                    <td class='quarter-width align-middle'>${
                      data.start_point
                    }</td>
                    <th class='quarter-width align-middle ps-4'>End point</th>
                    <td class='quarter-width align-middle'>${
                      data.end_point
                    }</td>
                    </tr>
                    <tr style='height: 80px'>
                    <th class='quarter-width align-middle ps-4'>Start time</th>
                    <td class='quarter-width align-middle'>
                        ${new Date(data.start_time).toLocaleDateString(
                          undefined,
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                          }
                        )}
                    </td>
                    <th class='quarter-width align-middle ps-4'>End time</th>
                    <td class='quarter-width align-middle'>
                        ${new Date(data.end_time).toLocaleDateString(
                          undefined,
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                          }
                        )}
                    </td>
                    </tr>
                    <tr style='height: 80px'>
                    <th class='quarter-width align-middle ps-4'>Duration</th>
                    <td class='quarter-width align-middle'>${msToTime(
                      data.duration
                    )}</td>
                    <th class='quarter-width align-middle ps-4'>Policy</th>
                    <td class='quarter-width align-middle'>${data.policy}</td>
                    </tr>
                    <tr style='height: 80px'>
                    <th class='quarter-width align-middle ps-4'>Number of seats</th>
                    <td class='quarter-width align-middle'>${
                      data.num_of_seats
                    }</td>
                    <th class='quarter-width align-middle ps-4'>Type of bus</th>
                    <td class='quarter-width align-middle'>${
                      data.type === 0
                        ? "Limousine"
                        : data.type === 1
                        ? "Normal Seat"
                        : "Sleeper Bus"
                    }</td>
                    </tr>
                    <tr style='height: 80px'>
                    <th class='quarter-width align-middle ps-4'>Ticket cost</th>
                    <td class='quarter-width align-middle'>${
                      data.ticket_cost
                    } VND</td>
                    <th class='quarter-width align-middle ps-4'>Total cost</th>
                    <td class='quarter-width align-middle'>${
                      data.total_cost
                    } VND</td>
                    </tr>
                    <tr style='height: 80px'>
                    <th class='quarter-width align-middle ps-4'>Seat positions</th>
                    <td class='quarter-width align-middle'>${data.seat_positions.join(
                      ", "
                    )}</td>
                    <th class='quarter-width align-middle ps-4'>Status</th>
                    <td id="status-td" class='quarter-width align-middle'>${
                      data.status === 0
                        ? "Booked"
                        : data.status === 1
                        ? "Paid"
                        : "Canceled"
                    }</td>
                    </tr>
                </tbody>
                </table>
            </div>
            <div class='btnShow'>
                <button type='button' class='btnShowForm'>
                Home
                </button>
                <button id="pay-btn" type='button' class='btnShowForm'>
                Pay
                </button>
            </div>
            </div>`;
        document.getElementById("form-container").innerHTML = template;
        document.querySelector(".home-btn").addEventListener("click", () => {
          window.location.href = "/";
        });
        document.getElementById("pay-btn").addEventListener("click", async () => {
          document.getElementById("status-td").textContent = "Paid";
          try {
            const paymentResponse = await fetch(
              `${import.meta.env.VITE_BACKEND_URL}/ticket/payment`,
              {
                method: "POST",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  ticket_ids: data.ticket_ids,
                }),
              }
            );
            const paymentData = await paymentResponse.json();
            console.log("[SUCCESS]", paymentData);

            localStorage.removeItem("url");

            // navigate('/payment-success');
            setIsPayment(true);
            setIsDisabled(false);
          } catch (error) {
            console.log(error);
            alert("[ERROR]", "Payment failed");
          }
        });
      }
    } catch (error) {
      console.log(error);
      alert("[ERROR]", "Something went wrong");
    }
  };

  return (
    <div className="bodyBus">
      <div
        id="title"
        className="mt-5 mb-5 card bg-light"
        style={{
          height: "150px",
          display: isDisabled ? "flex" : "none",
          backgroundColor: "#F8F9FA",
          textAlign: "center",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ fontSize: "26px", fontWeight: "bold" }}>
          Fill in booking form
        </p>
      </div>

      <div
        id="form-container"
        style={{ display: isDisabled ? "flex" : "none", width: "100%" }}
      >
        <form id="form" className="bodyForm">
          <div className="form-group rowfill">
            <label htmlFor="inputFullName" className="lableForm">
              Full Name
            </label>
            <input
              required
              type="text"
              className="form-control"
              id="inputFullName"
              name="inputFullName"
              placeholder="Full Name"
              autoFocus
            />
          </div>
          <div className="form-group rowfill">
            <label htmlFor="disabledEmail" className="lableForm">
              Email
            </label>
            <input
              readOnly
              type="text"
              className="form-control bg-secondary text-light"
              id="disabledEmail"
              name="disabledEmail"
              value={email ? email : "example@gmail.com"}
            />
          </div>
          <div className="form-group rowfill">
            <label htmlFor="inputPhone" className="lableForm">
              Phone
            </label>
            <input
              required
              type="text"
              className="form-control"
              id="inputPhone"
              placeholder="Phone Number"
              name="inputPhone"
              pattern="\d+"
            />
          </div>
          <div className="form-group rowfill">
            <label htmlFor="disabledStartTime" className="lableForm">
              Start Time
            </label>
            <input
              type="text"
              readOnly
              className="form-control bg-secondary text-light"
              id="disabledStartTime"
              name="disabledStartTime"
              value={
                dataBus.start_time
                  ? new Date(dataBus.start_time).toLocaleDateString(undefined, {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                    })
                  : "February 11th, 2022 18:00"
              }
            />
          </div>
          <div className="form-group rowfill">
            <label htmlFor="disabledEndTime" className="lableForm">
              End Time
            </label>
            <input
              type="text"
              readOnly
              className="form-control bg-secondary text-light"
              id="disabledEndTime"
              name="disabledEndTime"
              value={
                dataBus.end_time
                  ? new Date(dataBus.end_time).toLocaleDateString(undefined, {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                    })
                  : "February 11th, 2022 20:00"
              }
            />
          </div>
          <div className="form-group rowfill">
            <label htmlFor="destination" className="lableForm">
              Destination
            </label>
            <input
              type="text"
              readOnly
              className="form-control bg-secondary text-light"
              id="destination"
              name="destination"
              value={
                dataBus.bus_stations_buses_end_pointTobus_stations?.location
                  ? dataBus.bus_stations_buses_end_pointTobus_stations?.location
                  : "Hà Nội"
              }
            />
          </div>
          <div className="form-group rowfill">
            <label htmlFor="inputNumberOfSeat" className="lableForm">
              Number Of Seats
            </label>
            <input
              required
              type="text"
              className="form-control"
              id="inputNumberOfSeat"
              placeholder="Number of seats"
              pattern="^\d+$"
            />
          </div>
          <div className="listBTN">
            <button
              id="cancel-btn"
              type="button"
              className="btnFillFom "
              style={{ marginRight: "300px", width: "110px" }}
              onClick={() => handleCancel()}
            >
              Cancel
            </button>
            <button
              id="submit-btn"
              type="button"
              className="btnFillFom"
              style={{ width: "110px" }}
              onClick={() => handleSubmitForm()}
            >
              Submit
            </button>
          </div>
        </form>
      </div>

      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "white",
          padding: "20px",
          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
          zIndex: 1000,
          display: isPayment ? "block" : "none",
        }}
      >
        <div
          style={{
            backgroundColor: "#007bff",
            color: "white",
            padding: "10px",
            textAlign: "center",
          }}
        >
          Your payment is successful
        </div>
        <div style={{ padding: "20px" }}></div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "10px",
          }}
        >
          <button
            type="button"
            className="home-btn"
            style={{
              marginRight: "20px",
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
            onClick={() => handleHome()}
          >
            Home
          </button>
          <button
            type="button"
            style={{
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
            onClick={() => handlePrintPDF()}
          >
            Print PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default FillForm;
