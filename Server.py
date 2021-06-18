# -*- coding: utf-8 -*-

from MCTS import MCTS
from othello.OthelloGame import OthelloGame, display
from othello.OthelloPlayers import *
from othello.pytorch.NNet import NNetWrapper as NNet
import flask
import numpy as np
from utils import *

app = flask.Flask(__name__)
g = OthelloGame(8)
n1 = NNet(g)
n1.load_checkpoint('./','alphamodel.tar')
args1 = dotdict({'numMCTSSims': 50, 'cpuct':1.0})
mcts1 = MCTS(g, n1, args1)
p = lambda x: np.argmax(mcts1.getActionProb(x, temp=0))


def l2n(board):
	b = np.array(board)
	return b.reshape(8,8)
def n2l(board):
    return board.reshape(-1,).tolist()
@app.route('/')
def hello_world():
	return flask.render_template('Alphazero.html')

@app.route("/predict", methods=["POST"])
def predict():
	response = {
		"board": 0,
		"valid": 0,
		"gameover":0,
		"isSkip":False,
		"act":0
	}
	if flask.request.method == "POST":
		board = flask.request.get_json(force=True).get("board")
		player = flask.request.get_json(force=True).get("player")
		board = l2n(board)
		action = p(g.getCanonicalForm(board,-player))
		board, curPlayer = g.getNextState(board, -player, action)
		if(g.getGameEnded(board,1) != 0):
			if(g.getGameEnded(board,1) == 1):
				response["gameover"] = 1;
			else:
				response["gameover"] = -1;
		valids = g.getValidMoves(g.getCanonicalForm(board, curPlayer),1)
		if(valids[-1] == 1):
			response["isSkip"] = True
		response["act"] = int(action)
		response["board"] = n2l(board)
		response["valid"] = n2l(valids)
		return flask.jsonify(response)

@app.route("/actres", methods=["POST"])
def actres():
	response = {
		"board":[1],
		"valid":0,
		"gameover":0
	}
	if flask.request.method == "POST":
		board = flask.request.get_json(force=True).get("board")
		act = flask.request.get_json(force=True).get("action")
		player = flask.request.get_json(force=True).get("player")
		board = l2n(board)
		board, curPlayer = g.getNextState(board, player, act)
		if(g.getGameEnded(board,1) != 0):
			if(g.getGameEnded(board,1) == 1):
				response["gameover"] = 1;
			else:
				response["gameover"] = -1;
		response["board"] = n2l(board)
		return flask.jsonify(response)


@app.route("/initboard", methods=["POST"])
def initboard():
	response = {
        "board": [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,1,0,0,0,0,0,0,1,-1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        "valid": [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        "gameover": 0
    }
	if flask.request.method =="POST":
		turn = flask.request.get_json(force=True).get("player")
		if turn == 1:
			return flask.jsonify(response)
		else:
			board = g.getInitBoard()
			action = p(g.getCanonicalForm(board,1))
			board, curPlayer = g.getNextState(board, 1, action)
			valids = g.getValidMoves(g.getCanonicalForm(board, curPlayer),1)
			response["board"] = n2l(board)
			response["valid"] = n2l(valids)
			return flask.jsonify(response)

if __name__ == '__main__':
	#load_args()
	app.run(host="0.0.0.0", port=80, debug=True)