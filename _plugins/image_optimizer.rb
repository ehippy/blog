require 'image_optim'
require 'json'

Jekyll::Hooks.register :site, :post_write do |site|
  cache_file = File.join(site.dest, '.image_optim_cache.json')
  cache = File.exist?(cache_file) ? JSON.parse(File.read(cache_file)) : {}
  
  puts "Optimizing images in #{site.dest}/assets..."
  
  image_optim = ImageOptim.new(
    pngout: false,
    oxipng: false,
    svgo: false,
    skip_missing_workers: true,
    verbose: false
  )
  
  image_files = Dir.glob(File.join(site.dest, 'assets', '**', '*.{jpg,jpeg,png,gif}'), File::FNM_CASEFOLD)
  
  # Filter to only files that have changed since last optimization
  files_to_optimize = image_files.select do |file|
    current_mtime = File.mtime(file).to_s
    cached_mtime = cache[file]
    cached_mtime.nil? || cached_mtime != current_mtime
  end
  
  if files_to_optimize.any?
    puts "Optimizing #{files_to_optimize.length} of #{image_files.length} images..."
    total_saved = 0
    
    image_optim.optimize_images!(files_to_optimize) do |unoptimized, optimized|
      if optimized
        original_size = File.size(unoptimized)
        optimized_size = File.size(optimized)
        saved = original_size - optimized_size
        total_saved += saved
        percent = (saved * 100.0 / original_size).round(1)
        puts "  ✓ #{File.basename(optimized)}: -#{percent}%"
        
        # Update cache
        cache[optimized] = File.mtime(optimized).to_s
      end
    end
    
    puts "Total saved: #{(total_saved / 1024.0).round(1)} KB"
  else
    puts "All #{image_files.length} images already optimized (no changes detected)"
  end
  
  # Save cache for next build
  File.write(cache_file, JSON.generate(cache))
end
