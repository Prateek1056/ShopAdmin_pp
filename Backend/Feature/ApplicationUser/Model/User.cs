using Net_Backend.Common.Dto;
using Net_Backend.Data;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;

namespace Net_Backend.Feature.ApplicationUser.Model
{
    public class User : Record
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public Gender Gender { get; set; }
        public AddressModel Address { get; set; }
        public DateTime DateofBirth { get; set; }

    }

    public enum Gender
    {
        Undefined = 0,

        [Display(Name = "Male")]
        Male = 1,

        [Display(Name = "Female")]
        Female = 2,
    }

    public class UserDb : RecordDB<User>
    {
        public UserDb(MongoDBContext context, ClaimsPrincipal user) : base(context, user)
        { }
        public override string CollectionName => "Users";
    }
}