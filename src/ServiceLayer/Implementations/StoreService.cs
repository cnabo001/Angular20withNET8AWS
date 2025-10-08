using Contracts.DTOs;
using ServiceLayer.Interfaces;

namespace ServiceLayer.Implementations
{
    public class StoreService: IStoreService
    {
        public StoreService() { }

        public StoreItems GetAllStoreItems()
        {
            var result = new StoreItems()
            {
                Items = new List<StoreItem>()
                {
                    new StoreItem
                    {
                        Id = Guid.NewGuid(),
                        Name = "Test",
                        Description = "Testing these values",
                        Price = 50.00m
                    }
                }
            };
            return result;
        }
    }
}
