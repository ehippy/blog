require 'json'

module Jekyll
  class AssetPathReplacer
    def initialize(config)
      @config = config
    end

    Jekyll::Hooks.register :site, :post_write do |site|
      # Read the manifest
      manifest_path = File.join(site.dest, 'assets', '.sprockets-manifest-*.json')
      manifest_files = Dir.glob(manifest_path)
      
      next unless manifest_files.any?
      
      begin
        manifest = JSON.parse(File.read(manifest_files.first))
        assets = manifest['assets'] || {}
        
        # Find all HTML files and replace asset paths
        Dir.glob(File.join(site.dest, '**', '*.html')).each do |file|
          content = File.read(file)
          modified = false
          
          # Replace all asset references with fingerprinted versions
          assets.each do |original, fingerprinted|
            # Look for /assets/filename pattern
            if content.include?("/assets/#{original}")
              content = content.gsub(%r{/assets/#{Regexp.escape(original)}(?!-)}, "/assets/#{fingerprinted}")
              modified = true
            end
            
            # Also look for /images/filename pattern
            if content.include?("/images/#{original}")
              content = content.gsub(%r{/images/#{Regexp.escape(original)}}, "/assets/#{fingerprinted}")
              modified = true
            end
          end
          
          File.write(file, content) if modified
        end
      rescue => e
        Jekyll.logger.warn("AssetPathReplacer:", "Error processing manifest: #{e}")
      end
    end
  end
end
