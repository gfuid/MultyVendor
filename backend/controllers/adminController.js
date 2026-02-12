exports.approveStore = async (req, res) => {
    try {
        const { storeId } = req.params;

        // 1. Store ko approve karo
        const store = await Store.findByIdAndUpdate(
            storeId,
            { status: 'approved' },
            { new: true }
        );

        if (!store) return res.status(404).json({ message: "Store not found" });

        // 2. IMPORTANT: User model ko update karo (Yahi missing hai!)
        await User.findByIdAndUpdate(store.owner, {
            isSeller: true,
            sellerStatus: 'approved'
        });

        res.status(200).json({
            success: true,
            message: "Mubarak ho! Store aur User dono approve ho gaye hain."
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};