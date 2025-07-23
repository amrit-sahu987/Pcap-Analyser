#!/bin/bash

# Full path to input file
INPUT_FILE="$1"

# Get directory, filename, and extension
DIR=$(dirname "$INPUT_FILE")
FILENAME=$(basename "$INPUT_FILE")
EXT="${FILENAME##*.}"
BASENAME="${FILENAME%.*}"

# If file is .pcapng, convert to .pcap temporarily
if [[ "$EXT" == "pcapng" ]]; then
    TEMP_PCAP="$DIR/$BASENAME.temp.pcap"
    echo "Converting $INPUT_FILE to $TEMP_PCAP..."
    editcap -F libpcap "$INPUT_FILE" "$TEMP_PCAP"
    INPUT_FILE="$TEMP_PCAP"
    CLEAN_TEMP_PCAP=true
else
    CLEAN_TEMP_PCAP=false
fi

# Generate Argus binary
ARGUS_FILE="$DIR/$BASENAME.argus"
argus -r "$INPUT_FILE" -w "$ARGUS_FILE" #-S ARGUS_MUX_INTERVAL=60,ARGUS_INACTIVE_TIMEOUT=10,ARGUS_FLOW_STATUS_INTERVAL=60

# Convert Argus to CSV
CSV_FILE="$DIR/$BASENAME.csv"
ra -r "$ARGUS_FILE" -s saddr sport daddr dport proto dur pkts bytes -c , > "$CSV_FILE"

# Clean up
rm -f "$ARGUS_FILE"
if [ "$CLEAN_TEMP_PCAP" = true ]; then
    rm -f "$TEMP_PCAP"
fi