from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()


class TokenResponse(BaseModel):
    access_token: str


class CommandRequest(BaseModel):
    vin: str
    cmd: str
    args: dict = {}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/auth/token", response_model=TokenResponse)
def auth_token(username: str = "", password: str = ""):
    # Very small mock: accept any username/password for development
    if not username or not password:
        raise HTTPException(
            status_code=400, detail="username and password required"
        )
    return {"access_token": "devtoken"}


@app.get("/vehicles")
def list_vehicles():
    # Return a small mock VIN list
    return {"vins": ["1HGBH41JXMN109186", "WP0ZZZ99ZTS392124"]}


@app.get("/twin/{vin}")
def get_twin(vin: str):
    # Return mock telemetry for the VIN
    return {"vin": vin, "speed": 0, "locked": True}


@app.post("/command")
def send_command(req: CommandRequest):
    # Pretend to execute command and return success
    return {"status": "ok", "vin": req.vin, "cmd": req.cmd}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8000)
