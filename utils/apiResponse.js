export const successResponse = (
	res,
	data = null,
	message = "Success",
	status = 200,
) => {
	let code = Number(status);
	if (!Number.isInteger(code) || code < 100 || code > 599) code = 200;
	return res.status(code).json({
		success: true,
		message,
		data,
	});
};

export const errorResponse = (
	res,
	errors = null,
	message = "Something went wrong",
	status = 500,
) => {
	let code = Number(status);
	if (!Number.isInteger(code) || code < 100 || code > 599) code = 500;
	return res.status(code).json({ success: false, message, errors });
};
