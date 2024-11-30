const fileQueue = require('../utils/queue');

const getJobStatus = async (req, res) => {
  const { jobId } = req.params;
  const job = await fileQueue.getJob(jobId);

  if (!job) {
    return res.status(404).json({ message: 'Job not found' });
  }

  const state = await job.getState();
  const progress = job.progress();

  res.status(200).json({ state: state, progress: progress });
};

module.exports = { getJobStatus };
