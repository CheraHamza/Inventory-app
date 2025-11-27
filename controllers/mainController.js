getHomePage = async (req, res) => {
	res.render("home", { title: "Library Inventory" });
};

module.exports = {
	getHomePage,
};
