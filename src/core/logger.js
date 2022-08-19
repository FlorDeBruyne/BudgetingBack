const bunyan = require("bunyan");

let logger;

function reqSerializer(req) {
	return {
		method: req.method,
		url: req.url,
		headers: req.headers,
		body: req.body,
	};
}

function resSerializer(res) {
	return {
		body: res.body,
		status: res.status,
	};
}

const getLogger = () => {
	if (!logger) throw new Error("You must first initialize the logger");
	return logger;
};

const getChildLogger = (name) => {
	const logger = getLogger();
	return logger.child({ logger: name });
};

const initializeLogger = ({
	name,
	level,
	otherSerializers = {},
	otherStreams = [],
}) => {
	logger = bunyan.createLogger({
		name: name,
		level: level,
		serializers: {
			req: reqSerializer,
			res: resSerializer,
			err: bunyan.stdSerializers.err,
			...otherSerializers,
		},
		streams: [
			{
				stream: process.stdout,
				level: "trace",
			},
			...otherStreams,
		],
	});
};

module.exports = {
	getChildLogger,
	initializeLogger,
	getLogger
};
