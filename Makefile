HONCHO = honcho run

initdb:
	@$(HONCHO) python -W ignore -m tests.memdb database/