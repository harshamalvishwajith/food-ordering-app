using Microsoft.AspNetCore.Mvc;
using MenuService.Models;
using MenuService.Kafka;

namespace MenuService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MenuController : Controller
    {
        private readonly MenuService.Services.MenuService _service;
        private readonly KafkaProducer _kafkaProducer;

        public MenuController(MenuService.Services.MenuService service, KafkaProducer kafkaProducer)
        {
            _service = service;
            _kafkaProducer = kafkaProducer;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _service.GetAllAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(string id)
        {
            var item = await _service.GetAsync(id);
            return item == null ? NotFound() : Ok(item);
        }

        [HttpPost]
        public async Task<IActionResult> Create(MenuItem item)
        {
            await _service.CreateAsync(item);
            await _kafkaProducer.SendMessageAsync($"Menu Created: {item.Id}");
            return CreatedAtAction(nameof(Get), new { id = item.Id }, item);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, MenuItem item)
        {
            var existing = await _service.GetAsync(id);
            if (existing == null) return NotFound();

            item.Id = id;
            await _service.UpdateAsync(id, item);
            await _kafkaProducer.SendMessageAsync($"Menu Updated: {id}");
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var existing = await _service.GetAsync(id);
            if (existing == null) return NotFound();

            await _service.DeleteAsync(id);
            await _kafkaProducer.SendMessageAsync($"Menu Deleted: {id}");
            return NoContent();
        }
    }
}
