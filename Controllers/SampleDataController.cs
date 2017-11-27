using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace aspnetcore_react_sample.Controllers
{
    [Route("api/[controller]")]
    public class SampleDataController : Controller
    {

        [HttpGet("[action]")]
        public IEnumerable<FeedbackDto> Feedback(int startDateIndex)
        {
            var rng = new Random();
            using (var db = new FeedbackDb())
            {
                db.Connection.Open();
                // db.Connection is open and ready to use
            }
            return Enumerable.Range(1, 5).Select(index => new FeedbackDto
            {
                CreatedDateFormatted = DateTime.Now.AddDays(index + startDateIndex).ToString("d"),
                Name = rng.Next().ToString(),
                Comments = Summaries[rng.Next(Summaries.Length)],
                Status = Status.Pending.ToString(),
            });
        }

        public class FeedbackDto
        {
            public string CreatedDateFormatted { get; set; }
            public string ModifiedDateFormatted { get; set; }
            public string Name { get; set; }
            public string Email { get; set; }
            public string Comments { get; set; }
            public string Status { get; set; }

        }

        public enum Status
        {
            Pending,
            Seen,
            Addressed,

        }

        private static string[] Summaries = new[]
        {
            "Internet Problems", "Fix my laptop", "Love your church!", "Worship could be better", "Could you pray for me", "Feedback"

        };
    }
}
